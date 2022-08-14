use near_sdk::{env, near_bindgen, AccountId, Promise, collections::{ LookupMap }, json_types::U128};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};

const SEASON:&str = "2021";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug)]
pub struct NBABet {
    id: i64,
    market_maker_id: AccountId,
    market_maker_deposit: U128,
    better_deposit: U128,
    better: Option<AccountId>,
    game_id: String,
    game_date: String,
    start_time_utc: String,
    market_maker_team: String,
    bidder_team: String,
    better_found: bool,
    contract_locked: bool,
    winner: Option<AccountId>,
    winning_team: Option<String>,
    paid_out: bool
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NBABetsDate {
    season: String,
    bets: LookupMap<String, Vec<NBABet>>
}

//https://stackoverflow.com/questions/66379380/how-to-implement-multidimensional-hash-in-near-contract
impl Default for NBABetsDate {
    fn default() -> Self {
        panic!("Should be initialized before usage")
    }

}

#[near_bindgen]
impl NBABetsDate {
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            season: SEASON.to_string(),
            bets: LookupMap::new(b"bets".to_vec()),
        }
    }
    #[payable]
    pub fn create_bet(&mut self, better_amount:U128, game_id: String, game_date: String, market_maker_team: String, bidder_team: String, start_time_utc: String) {
        let game_day = game_date.clone();
        let game_id = game_id.clone();
        let amount = env::attached_deposit();
        let market_maker = env::signer_account_id();
        let mut bets = self.bets.get(&SEASON.to_string()).unwrap_or(vec![]);

        // QUESTION: This should create a unique ID each time right?
        let id = bets.last().map(|b| b.id + 1).unwrap_or(0);
        bets.push(NBABet { 
            id: id,
            market_maker_id: market_maker, 
            market_maker_deposit: U128(amount), 
            better_deposit: better_amount, 
            better: None, 
            game_id: game_id, 
            game_date: game_day.to_string(), 
            start_time_utc: start_time_utc.to_string(),
            market_maker_team: market_maker_team.to_string(), 
            bidder_team: bidder_team.to_string(), 
            better_found: false, 
            contract_locked: false, 
            winner: None, 
            winning_team: None,
            paid_out: false
        });
        self.bets.insert(&SEASON.to_string(), &bets);
    }

    #[payable]
    pub fn accept_bet_index(&mut self, id: i64) {
        let mut bet = self.get_bet_by_id(id);
        let deposit = U128(env::attached_deposit()); 

        assert!(bet.better_deposit == deposit, "The attached deposit does not match the bets deposit!");
        bet.better = Some(env::signer_account_id());
        bet.better_found = true;

        let mut bets_by_day = self.get_all_bets();
        let index = self.get_bet_index_by_id(id);
        
        bets_by_day.remove(index);
        bets_by_day.push(bet);
        self.bets.remove(&SEASON.to_string());
        self.bets.insert(&SEASON.to_string(), &bets_by_day);
    }

    // Cancel Market
    // Will need to figure out testing transfers
    #[private]
    fn return_funds_to_maker(&mut self, id:i64) -> Promise {
        let bet = self.get_bet_by_id(id);
        Promise::new(bet.market_maker_id).transfer(bet.market_maker_deposit.0)
    }

    #[private]
    fn return_funds_to_better(&mut self, id:i64) -> Promise {
        let bet = self.get_bet_by_id(id);
        assert!(bet.better_found == true, "No better was found.");
        Promise::new(bet.better.unwrap()).transfer(bet.better_deposit.0)
    }


    pub fn cancel_bet(&mut self, id:i64) {
        let bet = self.get_bet_by_id(id);
        assert!(bet.paid_out == false, "This bet as already been paid out.");
        assert!(bet.contract_locked == false, "The game is about to start. You cannot cancel this.");
        if bet.better_found == true  { 
            assert!(bet.better.unwrap() == env::signer_account_id() || bet.market_maker_id == env::signer_account_id(), "Please check your wallet. Your wallet is not better.");
            self.return_funds_to_better(id);
        };
        self.return_funds_to_maker(id);
        let mut bets_by_day = self.get_all_bets();

        let index = self.get_bet_index_by_id(id);
        bets_by_day.remove(index);
 
        self.bets.remove(&SEASON.to_string());
        self.bets.insert(&SEASON.to_string(), &bets_by_day);
    }

    fn pay_the_winner(winner: AccountId, payout: u128) -> Promise {
        Promise::new(winner).transfer(payout)
    }

    // Make private eventually but make a for loop to iterate through all bets.
    // This function needs to be reviewed. I think we can make this more efficient.
    pub fn payout_bet(&mut self, id: i64, winning_team: String) {
        let mut bet = self.get_bet_by_id(id);
        assert!(bet.paid_out == false, "This bet as already been paid out.");
        let market_maker_deposit = bet.market_maker_deposit.0;
        let mut better_deposit = 0;
        if bet.better_found == true {
            better_deposit = bet.better_deposit.0;
        };
        // Pay out is 97.5% of the total deposit
        let paid_out_amount = (better_deposit + market_maker_deposit) * 975 / 1000;
        let winning_team = winning_team.to_string();

        assert!(winning_team == bet.bidder_team || winning_team == bet.market_maker_team, "Team not found.");
        
        if winning_team == bet.bidder_team {
            //why do i neeed to use this format?
            bet.winner = bet.better.clone();
            NBABetsDate::pay_the_winner(bet.better.clone().unwrap(), paid_out_amount);
        } else {
            bet.winner = Some(bet.market_maker_id.clone());
            NBABetsDate::pay_the_winner(bet.market_maker_id.clone(), paid_out_amount);
        };

        bet.paid_out = true;
        
        let mut bets_by_day = self.get_all_bets();
        // get index of bet
        let index = self.get_bet_index_by_id(id);
        bets_by_day.remove(index);
        bets_by_day.push(bet);
        self.bets.remove(&SEASON.to_string());
        self.bets.insert(&SEASON.to_string(), &bets_by_day);
    }

    // Lock contract
    // Make private eventually but make a for loop to iterate through all bets.
    pub fn lock_contract(&mut self, id: i64) {
        let mut bet = self.get_bet_by_id(id);
        bet.contract_locked = true;
        let mut bets_by_day = self.get_all_bets();

        let index = self.get_bet_index_by_id(id);
        bets_by_day.remove(index);
        bets_by_day.push(bet);
        self.bets.remove(&SEASON.to_string());
        self.bets.insert(&SEASON.to_string(), &bets_by_day);
    }

    // View Methods
    
    pub fn get_all_bets(&self ) -> Vec<NBABet> {
        self.bets.get(&SEASON.to_string()).unwrap_or(vec![])
    }
    
    pub fn get_bet_index_by_id(&self, id: i64 ) -> usize {
        self.get_all_bets().iter().position(|x| x.id == id).unwrap()
    }
    
    pub fn get_bet_by_id(&self, id: i64 ) -> NBABet{
        self.get_all_bets().into_iter().filter(|x| x.id == id).nth(0).unwrap().clone()
    }

    // Returns a vector of all bets that do not have a better and contract is not locked.
    pub fn get_all_open_bets(&self) -> Vec<NBABet>{
        self.get_all_bets().into_iter().filter(|x| x.better_found == false && x.contract_locked == false).collect::<Vec<NBABet>>()
    }

    pub fn get_bets_by_account(&self, lookup_account: String) -> Vec<NBABet>{
        self.get_all_bets().into_iter().filter(|x| x.market_maker_id.to_string() == lookup_account || x.better.as_ref().unwrap().to_string() == lookup_account).collect::<Vec<NBABet>>()
    }

    pub fn get_open_bets_by_game_id(&self, game_id: String) -> Vec<NBABet>{
        self.get_all_bets().into_iter().filter(|x| x.game_id == game_id && x.better_found == false).collect::<Vec<NBABet>>()
    }

    pub fn get_bets_by_game_id(&self, game_id: String) -> Vec<NBABet>{
        self.get_all_bets().into_iter().filter(|x| x.game_id == game_id).collect::<Vec<NBABet>>()
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::{testing_env, VMContext};

    fn ntoy(near_amount: u128) -> U128 {
        U128(near_amount * 10u128.pow(24))
    }

    fn get_context() -> VMContext {
        VMContext {
            predecessor_account_id: "alice.testnet".to_string(),
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "bob.testnet".to_string(),
            signer_account_pk: vec![0],
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: ntoy(50).into(),
            account_locked_balance: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view: false,
            output_data_receivers: vec![],
            epoch_height: 19,
            storage_usage: 1000
        }
    }

    fn get_context_bidder() -> VMContext {
        VMContext {
            predecessor_account_id: "alice.testnet".to_string(),
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "boris.testnet".to_string(),
            signer_account_pk: vec![0],
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: ntoy(50).into(),
            account_locked_balance: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view: false,
            output_data_receivers: vec![],
            epoch_height: 19,
            storage_usage: 1000
        }
    }
    
    #[test]
    fn test_get_all_bets() {
        let mut context = get_context();
        context.attached_deposit = ntoy(10).into();
        testing_env!(context.clone());
        // let mut contract = NBABet::new(AccountId::try_from(context.current_account_id.clone()).unwrap());
        // contract.set_bet(ntoy(5).into());

        let mut contract = NBABetsDate::new();
        // Atlanta (1610612737) vs New York (1610612752)
        contract.create_bet(ntoy(5).into(),"0022100488".to_string(), "20211225".to_string(), "ATL".to_string(), "NYK".to_string(), "2021-12-25T17:00:00.000Z".to_string());
        // Boston (1610612738) vs Milwaukee (1610612749)
        contract.create_bet(ntoy(10).into(),"0022100489".to_string(), "20211225".to_string(), "BOS".to_string(), "MIL".to_string(), "2021-12-25T17:30:00.000Z".to_string());

        let bets =  contract.get_all_bets();
        // println!("{:#?}", bets);
        assert_eq!(bets[0].game_id, "0022100488".to_string());
    }

    #[test]
    fn test_get_bet_index() {
        let mut context = get_context();
        context.attached_deposit = ntoy(10).into();
        testing_env!(context.clone());
        // let mut contract = NBABet::new(AccountId::try_from(context.current_account_id.clone()).unwrap());
        // contract.set_bet(ntoy(5).into());

        let mut contract = NBABetsDate::new();
        // Atlanta (1610612737) vs New York (1610612752)

        contract.create_bet(ntoy(5).into(),"0022100488".to_string(), "20211225".to_string(), "ATL".to_string(), "NYK".to_string(), "2021-12-25T17:00:00.000Z".to_string());
        // Boston (1610612738) vs Milwaukee (1610612749)
        contract.create_bet(ntoy(10).into(),"0022100489".to_string(), "20211225".to_string(), "BOS".to_string(), "MIL".to_string(), "2021-12-25T17:30:00.000Z".to_string());
        // Creating dummy
        contract.create_bet(ntoy(5).into(),"0022100489".to_string(), "20211225".to_string(), "BOS".to_string(), "MIL".to_string(), "2021-12-25T17:30:00.000Z".to_string());
        contract.create_bet(ntoy(10).into(),"0022100488".to_string(), "20211225".to_string(), "ATL".to_string(), "NYK".to_string(), "2021-12-25T17:00:00.000Z".to_string());
        
        contract.cancel_bet(1);
        assert_eq!(contract.get_bet_index_by_id(2), 1);

    }

    #[test]
    #[should_panic(expected = "called `Option::unwrap()` on a `None` value")]
    fn get_bet_panic() {
        let mut context = get_context();
        context.attached_deposit = ntoy(10).into();
        testing_env!(context.clone());
        // let mut contract = NBABet::new(AccountId::try_from(context.current_account_id.clone()).unwrap());
        // contract.set_bet(ntoy(5).into());

        let contract = NBABetsDate::new();

        // contract.get_market("202112255".to_string())
        contract.get_bet_by_id(0);
    }

    #[test]
    fn accept_bet_by_id() {
        let mut context = get_context();
        context.attached_deposit = ntoy(10).into();
        testing_env!(context.clone());
        // let mut contract = NBABet::new(AccountId::try_from(context.current_account_id.clone()).unwrap());
        // contract.set_bet(ntoy(5).into());

        let mut contract = NBABetsDate::new();
        // Atlanta (1610612737) vs New York (1610612752)
        contract.create_bet(ntoy(5).into(),"0022100488".to_string(), "20211225".to_string(), "ATL".to_string(), "NYK".to_string(), "2021-12-25T17:00:00.000Z".to_string());
        let mut context_better = get_context_bidder();
        context_better.attached_deposit = ntoy(5).into();
        testing_env!(context_better.clone());
        contract.accept_bet_index(0);
        assert_eq!(contract.get_bet_by_id(0).better_found, true);
        assert_eq!(contract.get_bet_by_id(0).better.unwrap().as_str(), "boris.testnet");
    }

    #[test]
    fn cancel_bet() {
        let mut context = get_context();
        context.attached_deposit = ntoy(10).into();
        testing_env!(context.clone());
        // let mut contract = NBABet::new(AccountId::try_from(context.current_account_id.clone()).unwrap());
        // contract.set_bet(ntoy(5).into());

        let mut contract = NBABetsDate::new();
        // Atlanta (1610612737) vs New York (1610612752)
        contract.create_bet(ntoy(5).into(),"0022100488".to_string(), "20211225".to_string(), "ATL".to_string(), "NYK".to_string(), "2021-12-25T17:00:00.000Z".to_string());
        
        assert_eq!(contract.get_all_bets().len(), 1);
        contract.cancel_bet(0);
        // assert_eq!(contract.get_all_bets("20211225".to_string()).len(), 0);
    }

    #[test]
    fn payout_bet() {
        let mut context = get_context();
        context.attached_deposit = ntoy(10).into();
        testing_env!(context.clone());
        // let mut contract = NBABet::new(AccountId::try_from(context.current_account_id.clone()).unwrap());

        let mut contract = NBABetsDate::new();
        // Atlanta (1610612737) vs New York (1610612752)
        contract.create_bet(ntoy(5).into(),"0022100488".to_string(), "20211225".to_string(), "ATL".to_string(), "NYK".to_string(), "2021-12-25T17:00:00.000Z".to_string());
        let mut context_better = get_context_bidder();
        context_better.attached_deposit = ntoy(5).into();
        testing_env!(context_better.clone());
        contract.accept_bet_index(0);

        contract.payout_bet(0, "ATL".to_string());
        // println!("{:#?}", contract.get_bet_by_index(0));
        // assert_eq!(contract.get_bet_by_index(0).paid_out, true);
    }

    #[test]
    #[should_panic(expected = "The game is about to start. You cannot cancel this.")]
    fn lock_market() {
        let mut context = get_context();
        context.attached_deposit = ntoy(10).into();
        testing_env!(context.clone());
        // let mut contract = NBABet::new(AccountId::try_from(context.current_account_id.clone()).unwrap());
        // contract.set_bet(ntoy(5).into());

        let mut contract = NBABetsDate::new();
        // Atlanta (1610612737) vs New York (1610612752)
        contract.create_bet(ntoy(5).into(),"0022100488".to_string(), "20211225".to_string(), "ATL".to_string(), "NYK".to_string(),"2021-12-25T17:00:00.000Z".to_string());
        let mut context_better = get_context_bidder();
        context_better.attached_deposit = ntoy(5).into();
        testing_env!(context_better.clone());
        contract.accept_bet_index(0);
        contract.lock_contract(0);
        contract.cancel_bet(0);
    }

}

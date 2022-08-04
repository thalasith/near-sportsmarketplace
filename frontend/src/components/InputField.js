const InputField = (props) => {
  return (
    <div
      className={`flex flex-row lg:flex-col mx-2 w-full lg:w-${props.divWidth}`}
    >
      <label
        className="block text-gray-700 text-sm font-bold mx-1 px-1 py-1.5 w-1/2"
        htmlFor={props.placeholder}
      >
        {props.placeholder}
      </label>
      {props.errors.hasOwnProperty(props.name) ? (
        <span className="text-xs text-red-600 mx-5 lg:mx-1 px-1">
          {props.errors[props.name]}
        </span>
      ) : (
        <span className="text-xs text-red-600 mx-5 lg:mx-1 px-1">&nbsp;</span>
      )}
      <input
        type={props.inputType}
        name={
          props.placeholder.charAt(0).toLowerCase() +
          props.placeholder.slice(1).replace(" ", "")
        }
        className="form-control block w-1/8 mx-5 lg:mx-1 my-1 px-3 py-1.5 text-base font-normal placeholder-gray-500 text-black bg-gray-300 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-black focus:bg-white focus:border-black focus:outline-none w-full"
        placeholder={props.placeholder}
        onChange={(e) => props.changeHandler(e)}
      />
    </div>
  );
};

export default InputField;

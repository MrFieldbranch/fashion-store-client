type ErrorProps = {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const ErrorPopup = ({ error, setError }: ErrorProps) => {
  return (
    <div className="non-clickable-background" onClick={(e) => e.stopPropagation()}>
      <div className="pop-up">
        <p>{error}</p>
        <button className="go-back" onClick={() => setError(null)}>
          Tillbaka
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;

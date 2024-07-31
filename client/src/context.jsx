/**
 * Card component to display content in a styled card layout.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.bgcolor - The background color class for the card.
 * @param {string} props.txtcolor - The text color class for the card.
 * @param {string} props.header - The header text for the card.
 * @param {string} [props.title] - The optional title text for the card.
 * @param {string} [props.text] - The optional body text for the card.
 * @param {JSX.Element} props.body - The JSX element representing the body content of the card.
 * @param {string} [props.status] - The optional status text for the card.
 * @returns {JSX.Element} The rendered Card component.
 */
export default function Card(props) {
  /**
   * Returns the combined class names for the card based on the props.
   * @returns {string} The combined class names.
   */
  function classes() {
    const bg = props.bgcolor ? " bg-" + props.bgcolor : " ";
    const txt = props.txtcolor ? " text-" + props.txtcolor : " text-white";
    return "card mb-3 ms-auto me-auto " + bg + txt;
  }

  return (
    <form className={classes()} style={{ maxWidth: "18em", margin: "1.5em" }}>
      <div className="card-header text-center">{props.header}</div>
      <div className="card-body">
        {props.title && <h5 className="card-title">{props.title}</h5>}
        {props.text && <p className="card-text">{props.text}</p>}
        {props.body}
        {props.status && <div id="createStatus">{props.status}</div>}
      </div>
    </form>
  );
}

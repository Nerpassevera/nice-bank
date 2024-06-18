// import { Route, Link, UserContext, HashRouter } from "react-router-dom";


export default function Card(props) {
  function classes(){
    const bg = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
    const txt = props.txtcolor ? ' text-' + props.txtcolor : ' text-white';
    return 'card mb-3 ms-auto me-auto ' + bg + txt;

  }

  return (
      <form className={classes()} style={{maxWidth: "18em", margin: "1.5em"}}>
        <div className="card-header text-center">{props.header}</div>
        <div className="card-body">
          {props.title && (<h5 className="card-title">{props.title}</h5>)}
          {props.text && (<p className="card-text">{props.text}</p>)}
          {props.body}
          {props.status && (<div id="createStatus">{props.status}</div>)}


        </div>
      </form>
  )
}
 
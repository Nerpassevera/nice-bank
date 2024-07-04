import Card from "../context";
import BankImg from "../bank.png";
import { requestAll } from '../services/api.js'

/**
 * Renders the Home component.
 *
 * @returns {JSX.Element} The rendered Home component.
 */

requestAll().then( res => console.log(res));

export default function Home() {
  return (
    <Card
      txtcolor="black"
      header="BadBank Landing Page"
      title="Welcome to the bank"
      text="You can use this bank"
      body={<img src={BankImg} className="img-fluid" alt="bank_image" />}
    />
  );
}

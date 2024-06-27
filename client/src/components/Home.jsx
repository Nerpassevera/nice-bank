import Card from "../context";
import BankImg from "../bank.png";

/**
 * Renders the Home component.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
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

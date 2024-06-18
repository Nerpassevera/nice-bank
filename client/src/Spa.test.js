import { getByText, render, screen } from "@testing-library/react";
import Spa from "./index.js";
import userEvent from "@testing-library/user-event";

// test("Landing page loads", () => {
//   render(<Spa />);
//   screen.getByText("BadBank Landing Page");
//   screen.getByText("Welcome to the bank");
//   screen.getByText("You can use this bank");
//   screen.getByAltText("bank_image");
// });


  test("Deposit page loads with warning if no account logged in", () => {
    render(<Spa />);
    userEvent.click(screen.getByText("Deposit"));
    // setTimeout(() => {
      screen.getByText(
        "Important!"
      );
    // }, 0);
  });



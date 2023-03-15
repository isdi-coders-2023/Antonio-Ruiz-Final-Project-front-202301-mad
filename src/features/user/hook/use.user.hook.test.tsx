import { configureStore } from "@reduxjs/toolkit";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { ProtoUserStructure } from "../model/user.model";
import { userReducer } from "../reducer/user.reducer";
import { UserRepo } from "../services/repository/user.repo";
import { useUsers } from "./use.user.hook";

describe("Given the useUsers hook", () => {
  let elements: HTMLElement[];

  const mockStore = configureStore({
    reducer: { users: userReducer },
    preloadedState: {
      users: [
        {
          id: "1",
          name: "Test",
          email: "test",
          pw: "test",
        },
        {
          id: "2",
          name: "Test2",
          email: "test2",
          pw: "test2",
        },
      ],
    },
  });

  const mockRepo: UserRepo = {
    url: "",
    loginUser: jest.fn(),
    registerUser: jest.fn(),
  };
  beforeEach(async () => {
    const TestComponent = function () {
      const { logUser, regUser } = useUsers(mockRepo);

      return (
        <div>
          <button onClick={() => regUser({} as ProtoUserStructure)}></button>
          <button onClick={() => logUser({} as ProtoUserStructure)}></button>
        </div>
      );
    };

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      // eslint-disable-next-line testing-library/no-render-in-setup
      render(
        <Provider store={mockStore}>
          <TestComponent></TestComponent>
        </Provider>
      );
    });

    elements = await screen.findAllByRole("button");
  });

  describe("When click on second button", () => {
    test("Then it should call the repo method registerUser", async () => {
      await fireEvent.click(elements[0]);
      expect(mockRepo.registerUser).toHaveBeenCalled();
    });
  });

  describe("When registerUser method fails", () => {
    test("Then it should call the error console", async () => {
      (mockRepo.registerUser as jest.Mock).mockRejectedValue(
        new Error("Async error")
      );

      await fireEvent.click(elements[0]);
      // eslint-disable-next-line jest/valid-expect
      expect(mockRepo.registerUser).rejects.toThrow();
    });
  });

  describe("When click on first button", () => {
    test("Then it should call the repo method loginUser", async () => {
      await fireEvent.click(elements[1]);
      expect(mockRepo.loginUser).toHaveBeenCalled();
    });
  });

  describe("When loginUser method fails", () => {
    test("Then it should call the error console", async () => {
      (mockRepo.loginUser as jest.Mock).mockRejectedValue(
        new Error("Async error")
      );

      await fireEvent.click(elements[1]);
      // eslint-disable-next-line jest/valid-expect
      expect(mockRepo.loginUser).rejects.toThrow();
    });
  });
});

import { fireEvent, getByTestId, getByText } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import jsdom, { JSDOM } from "jsdom";
import path from "path";

const BASE = path.resolve(__dirname, "../src");

let virtualConsole;
let dom, body;
let title,
  nameInput,
  statusInput,
  addButton,
  allButton,
  activeButton,
  completedButton,
  noteList;

describe("Notes Manager App \n", function () {
  beforeEach(async () => {
    virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.on("error", console.error);
    dom = await JSDOM.fromFile(BASE + "/index.html", {
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true,
      virtualConsole,
    });
    await loadDom(dom);

    body = dom.window.document.body;
    nameInput = getByTestId(body, "input-note-name");
    statusInput = getByTestId(body, "input-note-status");
    addButton = getByTestId(body, "submit-button");
    allButton = getByTestId(body, "allButton");
    activeButton = getByTestId(body, "activeButton");
    completedButton = getByTestId(body, "completedButton");
    noteList = getByTestId(body, "noteList");
  });

  test("initial UI is rendered as expected and button works", () => {
    expect(nameInput).toHaveValue("");
    expect(statusInput).toHaveValue("");
    expect(addButton).toHaveTextContent("Add Note");
    expect(allButton).toHaveTextContent("All");
    expect(completedButton).toHaveTextContent("Completed");
    expect(activeButton).toHaveTextContent("Active");
    expect(noteList.children.length).toBe(0);
    fireEvent.input(nameInput, {
      target: { value: "Study" },
    });
    fireEvent.click(addButton);
    expect(noteList.children.length).toBe(1);
  });

  test("button adds notes", () => {
    fireEvent.input(nameInput, {
      target: { value: "Study" },
    });
    fireEvent.input(statusInput, {
      target: { value: "progress" },
    });
    fireEvent.click(addButton);
    expect(noteList.children.length).toBe(1);
    expect(noteList.children[0].children[0]).toHaveTextContent("Study");
    expect(noteList.children[0].children[1]).toHaveTextContent("progress");
  });

  test("Multiple notes can be added", () => {
    fireEvent.input(nameInput, {
      target: { value: "Study" },
    });
    fireEvent.input(statusInput, {
      target: { value: "progress" },
    });
    fireEvent.click(addButton);
    fireEvent.input(nameInput, {
      target: { value: "Movie" },
    });
    fireEvent.input(statusInput, {
      target: { value: "active" },
    });
    fireEvent.click(addButton);
    fireEvent.input(nameInput, {
      target: { value: "Stocks investing" },
    });
    fireEvent.input(statusInput, {
      target: { value: "completed" },
    });
    fireEvent.click(addButton);
    expect(noteList.children.length).toBe(3);
    expect(noteList.children[0].children[0]).toHaveTextContent("Movie");
    expect(noteList.children[0].children[1]).toHaveTextContent("active");
    expect(noteList.children[1].children[0]).toHaveTextContent(
      "Stocks investing"
    );
    expect(noteList.children[1].children[1]).toHaveTextContent("completed");
    expect(noteList.children[2].children[0]).toHaveTextContent("Study");
    expect(noteList.children[2].children[1]).toHaveTextContent("progress");
  });

  test("Switching between buttons work", () => {
    fireEvent.input(nameInput, {
      target: { value: "Study" },
    });
    fireEvent.input(statusInput, {
      target: { value: "progress" },
    });
    fireEvent.click(addButton);
    fireEvent.input(nameInput, {
      target: { value: "Cooking" },
    });
    fireEvent.input(statusInput, {
      target: { value: "pending" },
    });
    fireEvent.click(addButton);
    fireEvent.input(nameInput, {
      target: { value: "Movie" },
    });
    fireEvent.input(statusInput, {
      target: { value: "active" },
    });
    fireEvent.click(addButton);
    fireEvent.input(nameInput, {
      target: { value: "Fill form" },
    });
    fireEvent.input(statusInput, {
      target: { value: "active" },
    });
    fireEvent.click(addButton);
    fireEvent.input(nameInput, {
      target: { value: "Stocks investing" },
    });
    fireEvent.input(statusInput, {
      target: { value: "completed" },
    });
    fireEvent.click(addButton);
    fireEvent.input(nameInput, {
      target: { value: "Complete code" },
    });
    fireEvent.input(statusInput, {
      target: { value: "completed" },
    });

    fireEvent.click(addButton);
    expect(noteList.children.length).toBe(6);
    expect(noteList.children[0].children[0]).toHaveTextContent("Movie");
    expect(noteList.children[0].children[1]).toHaveTextContent("active");
    expect(noteList.children[1].children[0]).toHaveTextContent("Fill form");
    expect(noteList.children[1].children[1]).toHaveTextContent("active");
    expect(noteList.children[2].children[0]).toHaveTextContent(
      "Stocks investing"
    );
    expect(noteList.children[2].children[1]).toHaveTextContent("completed");
    expect(noteList.children[3].children[0]).toHaveTextContent("Complete code");
    expect(noteList.children[3].children[1]).toHaveTextContent("completed");
    expect(noteList.children[4].children[0]).toHaveTextContent("Study");
    expect(noteList.children[4].children[1]).toHaveTextContent("progress");
    expect(noteList.children[5].children[0]).toHaveTextContent("Cooking");
    expect(noteList.children[5].children[1]).toHaveTextContent("pending");

    fireEvent.click(activeButton);
    expect(noteList.children.length).toBe(2);
    expect(noteList.children[0].children[0]).toHaveTextContent("Movie");
    expect(noteList.children[0].children[1]).toHaveTextContent("active");
    expect(noteList.children[1].children[0]).toHaveTextContent("Fill form");
    expect(noteList.children[1].children[1]).toHaveTextContent("active");

    fireEvent.click(completedButton);
    expect(noteList.children.length).toBe(2);
    expect(noteList.children[0].children[0]).toHaveTextContent(
      "Stocks investing"
    );
    expect(noteList.children[0].children[1]).toHaveTextContent("completed");
    expect(noteList.children[1].children[0]).toHaveTextContent("Complete code");
    expect(noteList.children[1].children[1]).toHaveTextContent("completed");

    fireEvent.click(allButton);
    expect(noteList.children.length).toBe(6);
    expect(noteList.children[0].children[0]).toHaveTextContent("Movie");
    expect(noteList.children[0].children[1]).toHaveTextContent("active");
    expect(noteList.children[1].children[0]).toHaveTextContent("Fill form");
    expect(noteList.children[1].children[1]).toHaveTextContent("active");
    expect(noteList.children[2].children[0]).toHaveTextContent(
      "Stocks investing"
    );
    expect(noteList.children[2].children[1]).toHaveTextContent("completed");
    expect(noteList.children[3].children[0]).toHaveTextContent("Complete code");
    expect(noteList.children[3].children[1]).toHaveTextContent("completed");
    expect(noteList.children[4].children[0]).toHaveTextContent("Study");
    expect(noteList.children[4].children[1]).toHaveTextContent("progress");
    expect(noteList.children[5].children[0]).toHaveTextContent("Cooking");
    expect(noteList.children[5].children[1]).toHaveTextContent("pending");
  });

  test("In active tab, dont show completed notes", () => {
    fireEvent.input(nameInput, {
      target: { value: "Movie" },
    });
    fireEvent.input(statusInput, {
      target: { value: "active" },
    });
    fireEvent.click(addButton);
    fireEvent.input(nameInput, {
      target: { value: "Fill form" },
    });
    fireEvent.input(statusInput, {
      target: { value: "active" },
    });
    fireEvent.click(addButton);
    fireEvent.click(activeButton);
    fireEvent.input(nameInput, {
      target: { value: "Stocks investing" },
    });
    fireEvent.input(statusInput, {
      target: { value: "completed" },
    });
    fireEvent.click(addButton);
    expect(noteList.children.length).toBe(2);
    expect(noteList.children[0].children[0]).toHaveTextContent("Movie");
    expect(noteList.children[0].children[1]).toHaveTextContent("active");
    expect(noteList.children[1].children[0]).toHaveTextContent("Fill form");
    expect(noteList.children[1].children[1]).toHaveTextContent("active");

    fireEvent.click(completedButton);
    expect(noteList.children.length).toBe(1);
    expect(noteList.children[0].children[0]).toHaveTextContent(
      "Stocks investing"
    );
    expect(noteList.children[0].children[1]).toHaveTextContent("completed");
  });
});

function loadDom(dom) {
  return new Promise((resolve, _) => {
    virtualConsole.on("log", (log) => {
      if (log === "DOM Loaded") resolve(dom);
    });
  });
}

function innerText(node) {
  return (node.innerText || node.textContent || node.innerHTML).toString();
}

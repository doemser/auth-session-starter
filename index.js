import useSWR, { mutate } from "swr";

export async function fetchToDo(method, url, body) {
  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      mutate(url);
    }
  } catch (error) {
    console.error(error);
  }
}

export default function Home() {
  const url = "/api/to-dos";
  const { data: todos } = useSWR(url);

  return (
    <div style={{ fontSize: "x-large" }}>
      <h1>to-do-inator</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          const { todoInput } = Object.fromEntries(formData);

          fetchToDo("POST", url, { content: todoInput });

          event.target.reset();
        }}
      >
        <label htmlFor="todoInput">add to-do:</label>
        <input required type="text" id="todoInput" name="todoInput" />
        <button type="submit">add</button>
      </form>

      <ul>
        {todos?.map((todo) => {
          return (
            <li key={todo._id}>
              {todo.content}
              <button
                type="button"
                onClick={() => {
                  fetchToDo("DELETE", url, { id: todo._id });
                }}
              >
                delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

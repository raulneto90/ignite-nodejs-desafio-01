import { parse } from "csv-parse";
import { createReadStream } from "node:fs";

const csvPath = new URL("./tasks.csv");

const stream = createReadStream(csvPath);

const csvParse = parse({
  delimiter: ",",
  skip_empty_lines: true,
  from_line: 2,
});

async function start() {
  const linesParsed = stream.pipe(csvParse);

  for await (const line of linesParsed) {
    const [title, description] = line;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
}

start();

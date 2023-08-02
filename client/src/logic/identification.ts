import { v4 as uuidv4 } from "uuid";

export function getId(): string {
  let id = localStorage.getItem("userId");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("userId", id);
  }
  return id;
}

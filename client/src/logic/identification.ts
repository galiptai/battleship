import { v4 as uuidv4 } from "uuid";

export function getId(): string {
  let id = localStorage.getItem("userId");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("userId", id);
  }
  return id;
}

export function getLastUsedName(): string {
  const name = localStorage.getItem("name");
  return name ? name : "Player";
}

export function setName(name: string) {
  localStorage.setItem("name", name);
}

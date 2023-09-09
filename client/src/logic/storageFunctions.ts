import { v4 as uuidv4 } from "uuid";
import { GameSave, PlainGameSave } from "./GameSave";

const USER_ID_KEY = "userId";
const NAME_KEY = "name";
const GAME_SAVE_KEY = "gameSave";

export function getId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function getLastUsedName(): string {
  const name = localStorage.getItem(NAME_KEY);
  return name ? name : "Player";
}

export function saveName(name: string) {
  localStorage.setItem(NAME_KEY, name);
}

export function getGame(): PlainGameSave | null {
  const data = localStorage.getItem(GAME_SAVE_KEY);
  if (data) {
    return JSON.parse(data) as PlainGameSave;
  }
  return null;
}

export function saveGame(save: GameSave) {
  localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(save));
}

export function deleteGame() {
  localStorage.removeItem(GAME_SAVE_KEY);
}

import { ShipTypeKey } from "./Ship";
import { Dimensions } from "./renderFunctions";
import deepEqual from "deep-eql";

export type ShipAmount = { [key in ShipTypeKey]?: number };

export type RuleData = {
  dimensions: Dimensions;
  ships: ShipAmount;
};

export class Rules {
  static readonly MIN_HEIGHT = 5;
  static readonly MAX_HEIGHT = 26;
  static readonly MIN_WIDTH = 5;
  static readonly MAX_WIDTH = 26;
  static readonly MIN_SHIPS_TOTAL = 1;
  static readonly MIN_SHIPS_PER_TYPE = 0;
  static readonly MAX_SHIPS_PER_TYPE = 50;
  static readonly CLASSIC_RULES: RuleData = {
    dimensions: { height: 10, width: 10 },
    ships: {
      CARRIER: 1,
      BATTLESHIP: 1,
      CRUISER: 1,
      SUBMARINE: 1,
      DESTROYER: 1,
    },
  } as const;
  private valid: boolean;
  private height: number;
  private width: number;
  private ships: Map<ShipTypeKey, number>;

  constructor(height: number, width: number, ships: Map<ShipTypeKey, number>) {
    this.height = height;
    this.width = width;
    this.ships = ships;
    this.valid = this.verify();
  }

  static fromRuleData(ruleData: RuleData) {
    return new Rules(
      ruleData.dimensions.height,
      ruleData.dimensions.width,
      new Map(Object.entries(ruleData.ships) as [ShipTypeKey, number][])
    );
  }

  makeCopy(): Rules {
    return new Rules(this.height, this.width, this.ships);
  }

  getRuleData(): RuleData {
    const ruleData = {
      dimensions: { height: this.height, width: this.width },
      ships: Object.fromEntries(this.ships),
    };
    if (deepEqual(ruleData, Rules.CLASSIC_RULES)) {
      return Rules.CLASSIC_RULES;
    } else {
      return ruleData;
    }
  }

  public isValid(): boolean {
    return this.valid;
  }

  public getHeight(): number {
    return this.height;
  }

  public setHeight(height: number) {
    this.height = height;
    this.valid = this.verifyDimensions();
  }

  public getWidth(): number {
    return this.width;
  }

  public setWidth(width: number) {
    this.width = width;
    this.valid = this.verifyDimensions();
  }

  public getShips(): [ShipTypeKey, number][] {
    return Array.from(this.ships.entries());
  }

  public setShipAmount(shiptype: ShipTypeKey, amount: number) {
    this.ships.set(shiptype, amount);
    this.valid = this.verifyShips();
  }

  public getTotalShipAmount(): number {
    return Array.from(this.ships.values()).reduce((sum, next) => sum + next, 0);
  }
  private verify(): boolean {
    this.valid = this.verifyDimensions() && this.verifyShips();
    return this.valid;
  }

  private verifyDimensions(): boolean {
    if (
      this.height < Rules.MIN_HEIGHT ||
      this.height > Rules.MAX_HEIGHT ||
      this.width < Rules.MIN_WIDTH ||
      this.width > Rules.MAX_WIDTH
    ) {
      return false;
    }
    return true;
  }

  private verifyShips(): boolean {
    let total = 0;
    for (const shipEntry of this.ships.entries()) {
      const amount = shipEntry[1];
      if (amount < Rules.MIN_SHIPS_PER_TYPE || amount > Rules.MAX_SHIPS_PER_TYPE) {
        return false;
      }
      total += amount;
    }
    if (total < Rules.MIN_SHIPS_TOTAL) {
      return false;
    }
    return true;
  }
}

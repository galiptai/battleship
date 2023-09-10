import { Dimensions } from "./renderFunctions";
import deepEqual from "deep-eql";

export type RuleData = {
  dimensions: Dimensions;
};

export class Rules {
  static readonly MIN_HEIGHT = 5;
  static readonly MAX_HEIGHT = 26;
  static readonly MIN_WIDTH = 5;
  static readonly MAX_WIDTH = 26;
  static readonly CLASSIC_RULES: RuleData = {
    dimensions: { height: 10, width: 10 },
  } as const;
  private valid: boolean;
  private height: number;
  private width: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.valid = this.verify();
  }

  static fromRuleData(ruleData: RuleData) {
    return new Rules(ruleData.dimensions.height, ruleData.dimensions.width);
  }

  makeCopy(): Rules {
    return new Rules(this.height, this.width);
  }

  getRuleData(): RuleData {
    const ruleData = { dimensions: { height: this.height, width: this.width } };
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

  private verify(): boolean {
    this.valid = this.verifyDimensions();
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
}

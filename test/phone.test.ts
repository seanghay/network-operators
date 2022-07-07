import { describe, it, expect } from "vitest";
import {
	PhoneNumberPrefixDefinition,
	prefixes,
	prefixInfo,
	PhoneNumberPrefixesWithOperators,
	phoneNumberInfo,
	parsePhoneNumber,
	PhoneNumberParseResult,
	networkOperators,
} from "../src/index.js";

describe("phone number", () => {
	it("networkOperators", () => {
		expect(networkOperators()).toEqual([
			"Telecom Cambodia",
			"Cellcard",
			"CooTel",
			"Kingtel",
			"Seatel",
			"Metfone",
			"qb",
			"Smart",
		]);
	});

	it("prefixes", () => {
		expect(prefixes()).toBeTypeOf("object");
		expect(prefixes().length).toEqual(63);
	});

	it("should be Cellcard", () => {
		expect(phoneNumberInfo("+855 76 234 5678")!.operator).toEqual("Cellcard");
		expect(phoneNumberInfo("+855 12 123 4567")!.operator).toEqual("Cellcard");
		expect(phoneNumberInfo("+855 12 234 567")!.operator).toEqual("Cellcard");
		expect(phoneNumberInfo("+855 92 123 456")!.operator).toEqual("Cellcard");
	});

	it("should be CooTel", () => {
		expect(phoneNumberInfo("+855 38 383 8338")!.operator).toEqual("CooTel");
	});

	it("should be Kingtel", () => {
		expect(phoneNumberInfo("+855 39 9999 898")!.operator).toEqual("Kingtel");
	});

	it("should be Seatel", () => {
		expect(phoneNumberInfo("+855 18 912 3456")!.operator).toEqual("Seatel");
	});

	it("should be Metfone", () => {
		expect(phoneNumberInfo("+855 31 234 5678")!.operator).toEqual("Metfone");
		expect(phoneNumberInfo("+855 60 234 567")!.operator).toEqual("Metfone");
		expect(phoneNumberInfo("+855 88 234 5678")!.operator).toEqual("Metfone");
		expect(phoneNumberInfo("+855 97 234 5678")!.operator).toEqual("Metfone");
		expect(phoneNumberInfo("+855 71 234 5678")!.operator).toEqual("Metfone");
	});

	it("should be Metfone", () => {
		expect(phoneNumberInfo("+855 13 234 567")!.operator).toEqual("qb");
	});

	it("should be Smart", () => {
		expect(phoneNumberInfo("+855 96 234 5678")!.operator).toEqual("Smart");
		expect(phoneNumberInfo("+855 10 234 567")!.operator).toEqual("Smart");
	});

	it("should validate phone number", () => {
		expect(phoneNumberInfo("010123123")).toEqual({
			length: 6,
			number: "010123123",
			operator: "Smart",
			prefix: "010",
			suffix: "123123",
		});
	});

	it("should parse phone number", () => {
		expect(parsePhoneNumber("010123123")).toEqual<PhoneNumberParseResult>({
			prefix: "010",
			suffix: "123123",
			number: "010123123",
		});

		expect(parsePhoneNumber("10123123")).toEqual<PhoneNumberParseResult>({
			prefix: "010",
			suffix: "123123",
			number: "010123123",
		});

		expect(parsePhoneNumber("+85510123123")).toEqual<PhoneNumberParseResult>({
			prefix: "010",
			suffix: "123123",
			number: "010123123",
		});

		expect(parsePhoneNumber("+855 010123123")).toEqual<PhoneNumberParseResult>({
			prefix: "010",
			suffix: "123123",
			number: "010123123",
		});

		expect(parsePhoneNumber("+855(0)10123123")).toEqual<PhoneNumberParseResult>(
			{
				prefix: "010",
				suffix: "123123",
				number: "010123123",
			}
		);

		expect(
			parsePhoneNumber("(+855)10-123-123")
		).toEqual<PhoneNumberParseResult>({
			prefix: "010",
			suffix: "123123",
			number: "010123123",
		});
	});

	it("should return undefined if invalid prefix", () => {
		expect(prefixInfo("123" as any)).toBeUndefined();
	});

	it("should return prefix info", () => {
		for (const prefix of prefixes()) {
			expect(prefix).toBeTypeOf("string");
			expect(prefixInfo(prefix)).toBeTypeOf("object");
			expect(prefixInfo(prefix)).toEqual<PhoneNumberPrefixDefinition>(
				PhoneNumberPrefixesWithOperators[prefix]
			);
		}
	});

	it('should return prefix info for more than 3 chars', () => {
		expect(prefixInfo('03348')).toEqual({ 
			operator: "Telecom Cambodia", length: 4
		})

		expect(phoneNumberInfo('033484422')).toEqual({ 
			operator: "Telecom Cambodia", length: 4,
			number: "033484422",
			prefix: "03348",
			suffix: "4422"
		})
		
	})
});

export class NetworkOperatorError extends Error {
	constructor(message?: string) {
		super(message);
	}
}

// https://github.com/google/libphonenumber/blob/8a7f01e62e40d711863bd703295e56edb12b70a4/resources/carrier/en/855.txt

export const PhoneNumberPrefixesWithOperators = {
	"03248": { operator: "Telecom Cambodia", length: 4 },
	"03348": { operator: "Telecom Cambodia", length: 4 },
	"03448": { operator: "Telecom Cambodia", length: 4 },
	"03548": { operator: "Telecom Cambodia", length: 4 },
	"03648": { operator: "Telecom Cambodia", length: 4 },
	"04248": { operator: "Telecom Cambodia", length: 4 },
	"04348": { operator: "Telecom Cambodia", length: 4 },
	"04448": { operator: "Telecom Cambodia", length: 4 },
	"05248": { operator: "Telecom Cambodia", length: 4 },
	"05348": { operator: "Telecom Cambodia", length: 4 },
	"05448": { operator: "Telecom Cambodia", length: 4 },
	"05548": { operator: "Telecom Cambodia", length: 4 },
	"06248": { operator: "Telecom Cambodia", length: 4 },
	"06348": { operator: "Telecom Cambodia", length: 4 },
	"06448": { operator: "Telecom Cambodia", length: 4 },
	"06548": { operator: "Telecom Cambodia", length: 4 },
	"0235": { operator: "Cellcard", length: 6 },
	"011": { operator: "Cellcard", length: 6 },
	"012": { operator: "Cellcard", length: [6, 7] },
	"014": { operator: "Cellcard", length: 6 },
	"017": { operator: "Cellcard", length: 6 },
	"061": { operator: "Cellcard", length: 6 },
	"076": { operator: "Cellcard", length: 7 },
	"077": { operator: "Cellcard", length: 6 },
	"078": { operator: "Cellcard", length: 6 },
	"079": { operator: "Cellcard", length: 6 },
	"085": { operator: "Cellcard", length: 6 },
	"089": { operator: "Cellcard", length: 6 },
	"092": { operator: "Cellcard", length: 6 },
	"095": { operator: "Cellcard", length: 6 },
	"099": { operator: "Cellcard", length: 6 },
	"038": { operator: "CooTel", length: 7 },
	"039": { operator: "Kingtel", length: 7 },
	"018": { operator: "Seatel", length: 7 },
	"0236": { operator: "Metfone", length: 6 },
	"031": { operator: "Metfone", length: 7 },
	"060": { operator: "Metfone", length: 6 },
	"066": { operator: "Metfone", length: 6 },
	"067": { operator: "Metfone", length: 6 },
	"068": { operator: "Metfone", length: 6 },
	"071": { operator: "Metfone", length: 7 },
	"07248": { operator: "Metfone", length: 5 },
	"07348": { operator: "Metfone", length: 5 },
	"07448": { operator: "Metfone", length: 5 },
	"07548": { operator: "Metfone", length: 5 },
	"088": { operator: "Metfone", length: 7 },
	"090": { operator: "Metfone", length: 6 },
	"097": { operator: "Metfone", length: 7 },
	"013": { operator: "qb", length: 6 },
	"080": { operator: "qb", length: 6 },
	"083": { operator: "qb", length: 6 },
	"084": { operator: "qb", length: 6 },
	"010": { operator: "Smart", length: 6 },
	"015": { operator: "Smart", length: 6 },
	"016": { operator: "Smart", length: 6 },
	"069": { operator: "Smart", length: 6 },
	"070": { operator: "Smart", length: 6 },
	"081": { operator: "Smart", length: 6 },
	"086": { operator: "Smart", length: 6 },
	"087": { operator: "Smart", length: 6 },
	"093": { operator: "Smart", length: 6 },
	"096": { operator: "Smart", length: 7 },
	"098": { operator: "Smart", length: 6 },
} as const;

export type PhoneNumberPrefix = keyof typeof PhoneNumberPrefixesWithOperators;

export type PhoneNumberPrefixDefinition =
	typeof PhoneNumberPrefixesWithOperators[PhoneNumberPrefix];

export type NetworkOperator = PhoneNumberPrefixDefinition["operator"];

export type PhoneNumberInfo = PhoneNumberPrefixDefinition &
	PhoneNumberParseResult;

export interface PhoneNumberParseResult {
	prefix: PhoneNumberPrefix;
	suffix: string;
	number: string;
}

export function prefixes(): PhoneNumberPrefix[] {
	return Object.keys(PhoneNumberPrefixesWithOperators) as PhoneNumberPrefix[];
}

export function networkOperators(): NetworkOperator[] {
	const operators = Object.entries(PhoneNumberPrefixesWithOperators).map(
		([_, def]) => def.operator
	);
	return [...new Set(operators)];
}

export function prefixInfo<T extends PhoneNumberPrefix>(value: T) {
	return PhoneNumberPrefixesWithOperators[value];
}

export function phoneNumberInfoOrThrow(value: string) {
	const result = phoneNumberInfo(value);
	if (result) {
		return result;
	}

	throw new NetworkOperatorError(`value is invalid. value: ${value}`);
}

export function parsePhoneNumber(
	value: string
): PhoneNumberParseResult | undefined {
	let input: string = value;

	if (typeof input !== "string") {
		return;
	}

	input = input.replace(/[\s\-\(\)]+/gm, "");

	if (input.startsWith("+855")) {
		input = input.slice(4);
	}

	if (input.startsWith("855") || input.startsWith("855")) {
		input = input.slice(3);
	}

	if (input.startsWith("8550")) {
		input = input.slice(3);
	}

	if (!input.startsWith("0")) {
		input = "0" + input;
	}

	if (input.length < 9) {
		return;
	}

	const prefix = input.slice(0, 3) as PhoneNumberPrefix;
	const suffix = input.slice(3);
	return { prefix, suffix, number: input };
}

export function phoneNumberInfo(value: string): PhoneNumberInfo | undefined {
	const result = parsePhoneNumber(value);

	if (!result) {
		return;
	}

	const def = PhoneNumberPrefixesWithOperators[result.prefix];

	if (!def) {
		return;
	}

	const length = result.suffix.length;
	if (typeof def.length === "number") {
		if (def.length != result.suffix.length) {
			return;
		}
	} else {
		const [min, max] = def.length;
		if (length < min || length > max) {
			return;
		}
	}

	return {
		...def,
		...result,
	};
}

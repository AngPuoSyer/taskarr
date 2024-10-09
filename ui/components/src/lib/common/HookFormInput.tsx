import { FormControl, FormLabel, Input, FormErrorMessage, InputProps } from "@chakra-ui/react";
import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";

export interface HookFormInputProps<TFieldName extends string> {
	fieldName: TFieldName;
	label: string;
	register: UseFormRegisterReturn<TFieldName>;
	errors: FieldErrors;
	input: InputProps;
	isRequired?: boolean;
}

export function HookFormInput<TFieldName extends string>(props: HookFormInputProps<TFieldName>) {
	return (
		<FormControl isInvalid={!!props.errors[props.fieldName]} isRequired={props.isRequired}>
			<FormLabel htmlFor={props.input.id}>{props.label}</FormLabel>
			<Input
				{...props.input}
				{...props.register}
			/>
			<FormErrorMessage>
				{
					props.errors[props.fieldName] &&
					props.errors[props.fieldName]?.message?.toString()
				}
			</FormErrorMessage>
		</FormControl>
	)
}

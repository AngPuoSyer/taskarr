export type ErrorOptionsProps = {
	cause?: Error;
}

export class TaskarrException extends Error {
	cause?: Error;

	constructor(message, options?: ErrorOptionsProps) {
		super(message);
		this.cause = options?.cause;
	}
}

export class TaskarrUnauthorizedException extends TaskarrException { }

export class TaskarrInvalidArgumentException extends TaskarrException { }

export class TaskarrNotFoundException extends TaskarrException { }

export class TaskarrBusinessRuleException extends TaskarrException { }

export class TaskarrApplicationRuleException extends TaskarrException { }

export class TaskarrForbiddenException extends TaskarrException { }

export class TaskarrUnresolvedException extends TaskarrException { }

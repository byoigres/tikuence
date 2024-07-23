decorate(
    type: 'toolkit',
    property: DecorateName,
    method: (existing: ((...args: any[]) => any)) => DecorationMethod<ResponseToolkit>, options: {apply?: boolean | undefined, extend: true}): void;



decorate(
    type: 'toolkit',
    property: DecorateName,
    method: DecorationMethod<ResponseToolkit>,
    options?: {
        apply?: boolean | undefined,
        extend?: boolean | undefined
    }
): void;
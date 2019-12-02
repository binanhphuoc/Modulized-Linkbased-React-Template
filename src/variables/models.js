const Concept = [
    {
        key: "name",  // to extract data from API results
        label: "Name",    // to display on the table header and other UIs
        hiddenInTable: false,    // not shown in table
        isCollection: false,    // a collection will have a sidebar item to choose from
    },
    {
        key: "attributes",
        label: "Attributes",
        hiddenInTable: true,
        isCollection: true
    },
    {
        key: "equations",
        label: "Equations",
        hiddenInTable: true,
        isCollection: true
    }
];

const Attribute = [
    {
        key: "symbol",
        label: "Symbol",
        hiddenInTable: false,
        isCollection: false
    },
    {
        key: "description",
        label: "Description",
        hiddenInTable: false,
        isCollection: false
    }
];

const Equation = [
    {
        key: "name",
        label: "Name",
        hiddenInTable: false,
        isCollection: false
    },
    {
        key: "description",
        label: "Description",
        hiddenInTable: false,
        isCollection: false
    },
    {
        key: "syntax",
        label: "Syntax",
        hiddenInTable: false,
        isCollection: false
    }
];

export default { Concept, Attribute, Equation };
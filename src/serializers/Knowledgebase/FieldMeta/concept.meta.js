import TextFormatIcon from '@material-ui/icons/TextFormat';
import EmojiSymbolsIcon from '@material-ui/icons/EmojiSymbols';

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
        icon: TextFormatIcon,
        hiddenInTable: true,
        isCollection: true
    },
    {
        key: "equations",
        label: "Equations",
        icon: EmojiSymbolsIcon,
        hiddenInTable: true,
        isCollection: true
    }
];

export default Concept;
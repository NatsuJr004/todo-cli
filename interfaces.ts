interface UIinitialOptions{
    menu_options: string
}

interface UItaskQuestion{
    nameNewTask: string;
    continueOrComeBack: string;
}

type TypeAllTaks = {
    name: string; 
    checked: boolean;
}

interface UItaskSelect{
    optionSelect: string | number;
}

interface UIoptionsTask{
    optionSelect: string;
}

export {
    UIinitialOptions,
    UItaskQuestion,
    TypeAllTaks,
    UItaskSelect,
    UIoptionsTask
}
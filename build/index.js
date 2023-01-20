// import fetch from "node-fetch";
import Listr from "listr";
import { Observable } from "rxjs";
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from 'chalk-animation';
class DisplayCli {
    // private allTasks:any = [];
    // slaTask(){
    //   this.tasks = {msg: "hello"};
    //   console.log(this.getAllTasks);
    // }
    // public get getAllTasks():any{
    //   return this.allTasks;
    // }
    // public set tasks(data: any){
    //   this.allTasks = [...this.allTasks, data];
    // }
    newPromptDisplay(questions) {
        console.clear();
        return inquirer.prompt([...questions]);
    }
    displayNewTask(title, step1Msg, step2Msg, step1Time, step2Time) {
        return new Listr([
            {
                title: title,
                task: () => {
                    return new Observable((observer) => {
                        observer.next(step1Msg);
                        setTimeout(() => {
                            observer.next(step2Msg);
                        }, step1Time);
                        setTimeout(() => {
                            observer.complete();
                        }, step2Time);
                    });
                },
            }
        ]);
    }
    exitDisplay() {
        const glitch = chalkAnimation.rainbow('🤍 Obrigado pela sua presença!');
        setTimeout(() => {
            glitch.start();
        }, 1000);
        setTimeout(() => {
            glitch.stop();
            console.clear();
        }, 2000);
    }
}
class Todo extends DisplayCli {
    tasks = [];
    constructor() {
        super();
        this.start();
    }
    ;
    async start() {
        const initialOptions = await this.newPromptDisplay([
            {
                type: 'list',
                name: 'menu_options',
                message: 'Escolha uma opção:',
                choices: [
                    {
                        value: 'newTask',
                        name: 'Adicionar nova tarefa',
                    },
                    {
                        value: 'showTasks',
                        name: 'Ver todas tasks',
                    },
                    {
                        value: 'exit',
                        name: 'Sair',
                    },
                ],
            }
        ]);
        const typeCommand = {
            'newTask': () => this.newTask(),
            'showTasks': () => this.showTasks(),
            'exit': () => this.exitDisplay()
        };
        typeCommand[initialOptions.menu_options]();
    }
    ;
    async newTask() {
        const taskName = await this.newPromptDisplay([
            {
                type: 'input',
                name: 'nameNewTask',
                message: 'Informe um nome para uma nova task:',
            },
            {
                type: 'list',
                name: 'continueOrComeBack',
                message: 'Deseja continuar?',
                choices: [
                    {
                        value: 'sim',
                        name: 'sim'
                    },
                    {
                        value: 'nao',
                        name: 'não'
                    },
                ]
            }
        ]);
        if (taskName.continueOrComeBack == 'nao') {
            this.start();
            return;
        }
        ;
        this.tasks.push({
            name: taskName.nameNewTask,
            checked: false,
        });
        await this.displayNewTask('Adicionando nova task...', 'processando', 'finalizando', 2000, 4000)
            .run();
        this.start();
    }
    async showTasks() {
        const objAllTasks = this.tasks.map((task, index) => {
            return {
                value: index,
                name: task.checked
                    ? chalk.green(task.name)
                    : chalk.red(task.name),
            };
        });
        const taskSelected = await this.newPromptDisplay([
            {
                type: 'list',
                name: 'optionSelect',
                message: 'Tarefas registradas:',
                choices: [...objAllTasks, {
                        value: 'comeBack',
                        name: 'Voltar'
                    }],
            }
        ]);
        if (taskSelected.optionSelect == 'comeBack') {
            this.start();
            return;
        }
        ;
        if (typeof taskSelected.optionSelect == "number")
            this.optionsTask(taskSelected.optionSelect);
    }
    async optionsTask(indexTask) {
        const optionTask = await this.newPromptDisplay([
            {
                type: 'list',
                name: 'optionSelect',
                message: `Opções para essa tarefa:`,
                choices: [
                    {
                        value: 'changeCheck',
                        name: 'Marcar/Desmarcar tarefa como concluída'
                    },
                    {
                        value: 'removeTask',
                        name: 'Remover tarefa'
                    },
                    {
                        value: 'comeBack',
                        name: 'Voltar'
                    }
                ]
            }
        ]);
        const typeOption = {
            'comeBack': () => {
                this.showTasks();
                return;
            },
            'changeCheck': async () => await this.changeTask(indexTask),
            'removeTask': async () => await this.removeTask(indexTask),
        };
        await typeOption[optionTask.optionSelect]();
        this.showTasks();
    }
    async changeTask(indexTask) {
        this.tasks[indexTask].checked = !this.tasks[indexTask].checked;
        await this.displayNewTask('Alterando...', 'processando', 'finalizando', 2000, 4000)
            .run();
    }
    async removeTask(indexTask) {
        this.tasks.splice(indexTask, 1);
        await this.displayNewTask('Removendo...', 'processando', 'Concluindo', 2000, 4000)
            .run();
    }
}
new Todo();

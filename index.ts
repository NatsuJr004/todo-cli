// import fetch from "node-fetch";
import Listr, { ListrTask, ListrTaskObject, ListrTaskResult } from "listr";
import { Observable } from "rxjs";
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from 'chalk-animation';
import {
  TypeAllTaks,
  UIinitialOptions,
  UIoptionsTask,
  UItaskQuestion,
  UItaskSelect,
} from "./interfaces";

class DisplayCli{
  protected newPromptDisplay(questions: Array<Object>):Promise<any>{
    console.clear();
    return inquirer.prompt([...questions])
  }

  protected displayNewTask(title:string, step1Msg:string, step2Msg:string, step1Time:number, step2Time:number):Listr<any>{
    
    return new Listr([
      {
        title: title,
        task: ():any => {
          return new Observable((observer: any) => {
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

  protected exitDisplay():void{
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

class Todo extends DisplayCli{
  protected tasks:Array<TypeAllTaks> = [];

  constructor(){
    super();
    this.start();
  };
  
  async start():Promise<void>{
    const initialOptions:UIinitialOptions = await this.newPromptDisplay([
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

    const typeCommand: any = {
      'newTask': () => this.newTask(),
      'showTasks': () => this.showTasks(),
      'exit': () => this.exitDisplay()
    }

    typeCommand[initialOptions.menu_options]();
  };

  async newTask():Promise<void>{
    const taskName: UItaskQuestion = await this.newPromptDisplay([
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
    ])

    if(taskName.continueOrComeBack == 'nao'){
      this.start();
      return;
    };

    this.tasks.push({
      name: taskName.nameNewTask,
      checked: false,
    })

    await this.displayNewTask(
      'Adicionando nova task...', 
      'processando', 
      'finalizando', 
      2000, 4000)
      .run();
    
    this.start();
  }

  async showTasks():Promise<void>{
    const objAllTasks = this.tasks.map(
        (task: TypeAllTaks, index: number) => {
            return {
                value: index,
                name: task.checked
                    ? chalk.green(task.name)
                    : chalk.red(task.name),
            };
        }
    );

    const taskSelected:UItaskSelect = await this.newPromptDisplay([
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

    if(taskSelected.optionSelect == 'comeBack') {
      this.start();
      return;
    };

    if(typeof taskSelected.optionSelect == "number")
      this.optionsTask(taskSelected.optionSelect);
  }

  async optionsTask(indexTask: number):Promise<void>{
    const optionTask:UIoptionsTask = await this.newPromptDisplay([
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

    const typeOption: any = {
      'comeBack': () => {
        this.showTasks();
        return;
      },
      'changeCheck': async () => await this.changeTask(indexTask),
      'removeTask': async () => await this.removeTask(indexTask),
    }
    
    await typeOption[optionTask.optionSelect]();
    this.showTasks();
  }

  async changeTask(indexTask: number):Promise<void>{
    this.tasks[indexTask].checked = !this.tasks[indexTask].checked;
    await this.displayNewTask(
      'Alterando...', 
      'processando', 
      'finalizando', 
      2000, 4000)
      .run();
  }

  async removeTask(indexTask: number):Promise<void>{
    this.tasks.splice(indexTask, 1)
    await this.displayNewTask(
      'Removendo...', 
      'processando', 
      'Concluindo', 
      2000, 4000)
      .run();
  }
}

new Todo();
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(beaker) Weather search";
  item.command = "vsweather.searchSelected";
  item.show();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vsweather-sidebar",
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsweather.helloWorld", () => {
      vscode.window.showInformationMessage(
        "token is " + TokenManager.getToken()
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsweather.authenticate", () => {
      authenticate();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsweather.refresh", async () => {
      // HelloWorldPanel.kill();
      // HelloWorldPanel.createOrShow(context.extensionUri);
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vsweather-sidebar-view"
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsweather.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "how was your day?",
        "good",
        "bad"
      );

      if (answer === "bad") {
        vscode.window.showInformationMessage("Sorry to hear that :(");
      } else {
        console.log(answer);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsweather.searchSelected", async () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active editor window");
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );

      sidebarProvider._view?.webview.postMessage({
        type: "new-search",
        value: text,
      });
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

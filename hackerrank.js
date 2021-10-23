
// node .\hackerrank.js --source=https://www.hackerrank.com --dest=config.json --solution=solution.json
// node .\hackerrank.js --source=https://www.hackerrank.com --dest=config.json 

let minimist = require("minimist");
let puppeteer = require("puppeteer");
let fs = require("fs");

let args = minimist(process.argv);
let configJSON = fs.readFileSync(args.dest, "utf-8");
let configJSO = JSON.parse(configJSON);

// Code answers
let answerArray = {
    answers : [
        `public class Solution { 
             public static void main(String[] args) {
                    System.out.println("Hello, World."); 
                    System.out.println("Hello, Java."); 
            }
        }`
        ,
        `import java.util.*;

        public class Solution {
        
            public static void main(String[] args) {
                Scanner scan = new Scanner(System.in);
                int a = scan.nextInt();
                int b = scan.nextInt();
                int c = scan.nextInt();
                
        
                System.out.println(a);
                System.out.println(b);
                System.out.println(c);
        
            }
        }`,
        `import java.io.*;
        import java.math.*;
        import java.security.*;
        import java.text.*;
        import java.util.*;
        import java.util.concurrent.*;
        import java.util.regex.*;
        
        public class Solution {
        
            private static final Scanner scanner = new Scanner(System.in);
        
            public static void main(String[] args) {
                int n = scanner.nextInt();
                
                if(n%2 == 1 || n>= 6 && n<=20){
                  System.out.println("Weird");
                }
                else if (n%2 == 0 || n >= 2 && n <= 5){
                    System.out.println("Not Weird");    
                }
                else{
                    System.out.println("Not Weird");  
                }
                scanner.close();
            }
        }`,
        `import java.util.Scanner;

        public class Solution {
        
            public static void main(String[] args) {
                Scanner scan = new Scanner(System.in);
                int i = scan.nextInt();
                double d = scan.nextDouble();
                String s = scan.nextLine();
                
                if(scan.hasNextLine() || s.isEmpty()){
                    s = scan.nextLine();
                }
        
                System.out.println("String: " + s);
                System.out.println("Double: " + d);
                System.out.println("Int: " + i);
            }
        }`,

    ]
}


async function run(){

    let browser = await puppeteer.launch({
        headless : false,
        args : [ 
            '--start-maximized'
        ],
        defaultViewport : null
    });

    let pages = await browser.pages();

    let page = pages[0];

    await page.goto(args.source + "/auth/login" );

    // await page.waitForSelector("a[href='https://www.hackerrank.com/access-account/']");
    // await page.click("a[href='https://www.hackerrank.com/access-account/']");

    // await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    // await page.click("a[href='https://www.hackerrank.com/login']");

    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']" , configJSO.username , {delay : 5});
   
    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", configJSO.password, {delay : 5});

    await page.waitForSelector("button[type='submit']");
    await page.click("button[type='submit']");


    await page.waitForSelector("a[href='/domains/java']");
    await page.click("a[href='/domains/java']");
    
    await page.waitFor(3000);

    await page.waitForSelector("input[value='solved']");
    await page.click("input[value='solved']");

    await page.waitFor(3000);

    await page.waitForSelector("a.js-track-click.challenge-list-item");
    
    let curls = await page.$$eval("a.js-track-click.challenge-list-item", function(atags){

        let urls = [];
        for(let i = 0; i < atags.length ; i++){
            
            let url = atags[i].getAttribute("href");
            urls.push(url);
        }
        return urls;
    });

    console.log(curls);


    for(let i = 0; i < 4; i++){

        let newPage = await browser.newPage();
        await newPage.goto(args.source + curls[i]);
        await newPage.waitFor(2000);

        await newPage.waitForSelector("input[type='checkbox']");
        await newPage.click("input[type='checkbox']");

        await newPage.waitForSelector("textarea[aria-describedby='tooltip-input-1']" ); 
        await newPage.type("textarea[aria-describedby='tooltip-input-1']", answerArray.answers[i] , {delay : 5});
        await newPage.waitFor(3000);

        await newPage.keyboard.down("Control");
        await newPage.keyboard.press('A' , {delay : 50});
        await newPage.keyboard.press('X' , {delay : 50});
        await newPage.keyboard.up("Control");

        await newPage.waitForSelector("div.monaco-editor.no-user-select.vs");
        await newPage.click("div.monaco-editor.no-user-select.vs");

        await newPage.keyboard.down("Control");
        await newPage.keyboard.press('A', {delay : 50});
        await newPage.keyboard.up("Control");

        await newPage.keyboard.press("Backspace");

        await newPage.keyboard.down("Control");
        await newPage.keyboard.press('V', {delay : 50});

        await newPage.waitForSelector("button.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");
        await newPage.click("button.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");

        await newPage.waitFor(3000);

        await newPage.close();
        // break;
    }
    await page.close();
}

run();

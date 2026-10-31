import {chromium} from 'playwright';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:375,height:812}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const assert=(value,message)=>{if(!value)throw Error(message)};
await page.goto('http://localhost:5173/');
const launch=page.getByRole('button',{name:'Explore live demo'});
for(let i=0;i<3;i++){
 await launch.nth(i).click();const dialog=page.getByRole('dialog');assert(await dialog.isVisible(),'Demo failed to open');
 if(i===0){await dialog.getByLabel('Search transactions').fill('no-such-customer');assert(await dialog.getByText('No matching transactions.').isVisible(),'Dashboard empty search failed');await dialog.getByLabel('Report period').selectOption('Last month');}
 if(i===1){await dialog.getByRole('button',{name:'All',exact:true}).click();await dialog.getByLabel('Add Everyday tote to cart').click();await dialog.getByLabel('Toggle shopping cart').click();await dialog.getByLabel('Add one Everyday tote').click();assert((await dialog.locator('.cart-panel').innerText()).includes('$78.00'),'Mobile cart quantity failed');await dialog.getByLabel('Remove one Everyday tote').click();await dialog.getByLabel('Remove one Everyday tote').click();}
 if(i===2){await dialog.getByLabel('New task').fill('   ');await dialog.getByLabel('Add task',{exact:true}).click();const before=await dialog.locator('.task-row').count();await dialog.getByLabel('New task').fill('Mobile test task');await dialog.getByLabel('Task priority').selectOption('High');await dialog.getByLabel('Add task',{exact:true}).click();assert(await dialog.locator('.task-row').count()===before+1,'Mobile task creation failed');await dialog.getByLabel('Mark Mobile test task complete').click();await dialog.getByRole('button',{name:'Active',exact:true}).click();assert(!(await dialog.locator('.task-list').innerText()).includes('Mobile test task'),'Active filter failed');await dialog.getByRole('button',{name:'Completed',exact:true}).click();await dialog.getByLabel('Delete Mobile test task').click();}
 assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Demo horizontal overflow');await dialog.getByLabel('Close project').click();assert(await page.locator('dialog').count()===0,'Demo close failed');
}
assert(!errors.length,errors.join('; '));console.log('PASS: all three mobile demo launchers and interactions, empty search, cart quantities, task priorities/filters, modal layout and closing.');await browser.close();

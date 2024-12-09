import { test, expect , chromium} from '@playwright/test';
import {Homepage} from '../locators/locators';

test.describe("Test to Book flight in MMT", () =>{

    test("test1", async ({})=>{
        
        const browser = await chromium.launch({ headless: false });

        const context = await browser.newContext({ ignoreHTTPSErrors: true });
        const page = await context.newPage();
        await page.goto('https://www.makemytrip.com/', { waitUntil: 'domcontentloaded' });

        //click the cross button of the pop up
        await page.locator(Homepage.HomePageCrossButton).click()

        //select flights 
        await page.locator(Homepage.HomePageSelectFlights).click()
        
        //select flight from
        await page.locator(Homepage.HomePageFlightFromLabel).click()
        await page.locator(Homepage.HomePageFlightSearchInput).fill('delhi')
        await page.locator(Homepage.TopFlighShowing).click()

        //select fligh to
        await page.locator(Homepage.HomePageFlightToLabel).click()
        await page.locator(Homepage.HomePageFlightSearchInput).fill('dehradun')
        await page.locator(Homepage.TopFlighShowing).click()


        const calendarField = page.locator(Homepage.CalendarField);
        await expect(calendarField).toBeVisible();

        const dates = await page.locator(Homepage.CalendarDateElements).elementHandles()
        
        const fares: { fare: number; date: string }[] = [];


        for (const dateElement of dates) {
            const dateAttribute = await dateElement.$eval("p", node=>node.textContent);

            try{
                const fareText = await dateElement.$eval('//p[@class=" todayPrice"]', node=>node.textContent);
                console.log(fareText)
                if (fareText){
                const fare = parseInt(fareText.replace(/[^0-9]/g, ''), 10); //remove unwanted char and convert to integer

                    if(dateAttribute){
                        fares.push({fare, date: dateAttribute})
                    }
                }
            }
            catch{
                const fareText = "null" //Not taking dates with null fare price
            }
        }
        console.log(fares);

        const lowestFareDate = fares.sort((a, b) => a.fare - b.fare || a.date.localeCompare(b.date))[0];

        console.log(`Lowest fare: Rs ${lowestFareDate.fare}, Date: ${lowestFareDate.date}`);


        await page.locator('//div[@class="dateInnerCell" and p[1][text()="6"] and p[2][text()="3,999"]]').click()

        await page.locator('//a[text()="Search"]').click()
        // await page.locator('//a[text()="Search"]').click()

        // const nextpagevalidation = page.locator('//div[@id="search-widget"]');
        // await expect(nextpagevalidation).toBeVisible();
    });

    test("test2", async() =>{
        const browser = await chromium.launch({ headless: false });

        const context = await browser.newContext({ ignoreHTTPSErrors: true });
        const page = await context.newPage();
        await page.goto('https://www.makemytrip.com/flight/search?itinerary=DEL-DED-14/12/2024&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E&ccde=IN&lang=eng', { waitUntil: 'domcontentloaded' });

        //click the cross button of the pop up
        try{
        const loginModal = page.locator('//span[@class="bgProperties overlayCrossIcon icon20"]');
        await loginModal.click();
        }catch{}
        // await page.locator('//span[@class="bgProperties overlayCrossIcon icon20"]').click()

        //select flights 
        await page.locator('//button[@id="bookbutton-RKEY:21e11067-dbae-49c2-b8ae-89c198d20d5e:19_0"]').click()
    });

    


});

//div[@class="dateInnerCell" ]/p[text()='6' and text()='3999']
//div[@class="dateInnerCell"]/p[1][text()='6'] p[2][text()='3,999']
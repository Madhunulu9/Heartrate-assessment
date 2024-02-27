import fs from 'fs';
import path from 'path';

const inputFilepath=path.resolve(`heartrate.json`);
const inputData=fs.readFileSync(inputFilepath,'utf-8');
const inputjson=Json.parse(inputData);
const outputJson=calculateStats(inputjson);

type InputType={ beatsperminute: number; timestamps:{starttime: string; endtime:string}}[];
type OutputType= {date:string; min:number;max:number;median:number;latestTimestamp: string}[];

function  calculateStats(input:InputType):OutputType{
    const stats:{[date:string]:{values:number[]; latestTimestamp}}={};
    for(const item of input){
        const date= item.timestamps.split('T')[0];
        if (!stats[date]){
            stats[date]={values:[item.beatsperminute],latestTimestamp:item.timestamps.endtime};

        }else{
            stats[date].values.push(item.beatsperminute);
            if(item.timestamps.endtime>stats[date].latestTimestamp){
                stats[date].latestTimestamp=item.timestamps.endtime;
            }
        }
    }
    return Object.entries(stats).map(([date, {values,latestTimestamp}])=> {
    values.sort((a,b)=>a-b);
    const median = values.length%2===0?(values[values.length/2-1]+values[values.length/2-1]+values[values.length/2])/2:values[values.length/2];
    return{date,min:values[0],max:values[values.length-1],median,latestTimestamp};
});
}


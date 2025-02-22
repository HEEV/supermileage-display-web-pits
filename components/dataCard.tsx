import { Card, CardContent } from "./ui/card";


export default function DataCard(props: {dataValue: number, dataName: string}) {
  return (
    <Card className="w-7/8 min-w-[270px] p-5 m-1">
        <CardContent className="flex flex-col items-center">
            <h1 className=" m-10 text-9xl">{props.dataValue}</h1>
            <p>{props.dataName}</p>
        </CardContent>
    </Card>
  );

}
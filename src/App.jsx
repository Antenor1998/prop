import { useState } from 'react'
import './App.css'
import { evaluate, exp, log, round } from 'mathjs';
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Textarea, Switch, Button} from "@nextui-org/react";
import {Input} from "@nextui-org/input";


function App() {

  const [isSelect, setIsSelect] = useState(false)
  const [x1, setX1] = useState(1)
  const [x2, setX2] = useState(2)
  const [decimales, setDecimales] = useState(5)
  const [error, setError] = useState(0.00001)
  const [formula, setFormula] = useState("exp(-x) - log(x)") // exp(-x) - log(x)   y = x^2 - 3
  const [dataTable, setDataTable] = useState([])
  let table = [];

  const onClick =() => {
    let x = x1;
    let y = x2;
    let resp = false;
    setDataTable([]);
    table = [];
    do {
      const data =  generateTable(x, y)
      if(table.length > 1) {
        resp = valueError(data.r);
        if(!resp) {
          if((data.fx1 * data.fxr) < 0){
            y = data.xr
          }else if((data.fx1 * data.fxr) > 0){
            x = data.xr
          } else if((data.fx1 * data.fxr) === 0) resp = true
        }else{
          resp = true
        }
      }else{
        if((data.fx1 * data.fxr) < 0){
          y = data.xr
        }else if((data.fx1 * data.fxr) > 0){
          x = data.xr
        } else if((data.fx1 * data.fxr) === 0) resp = true
      }


    } while (resp === false);
  }

  const generateTable = (x1, x2) => {

    let obj = {
      x1: x1,
      x2: x2,
      fx1: round(getFx(x1), decimales),
      fx2: round(getFx(x2), decimales),
    }

    obj.xr =round( getXr(obj.fx1, obj.fx2, obj.x1, obj.x2), decimales)
    obj.fxr = round(getFx(obj.xr), decimales)
    if(table.length >= 1){
      const objAnt = table[table.length - 1];
      obj.r = round(((objAnt.xr - obj.xr) / objAnt.xr) * 100, decimales)
      obj.r = Math.abs(obj.r)
    }else {
      obj.r = 0
    }
    table.push(obj);
    setDataTable(prevDataTable => [...prevDataTable, obj]);
    return obj
  }

  const valueError = (res) =>  {
    return res <= error
  }

  const getFx = (number) => {
    const scope = { x: number };
    return evaluate(formula, scope)
  }

  const getXr = (fx1, fx2, x1, x2) => {
    const scope = { fx1: fx1, fx2: fx2, x1: x1, x2: x2  };
    return evaluate(' xr = x2 -( fx2 * (x1 - x2) /(fx1 - fx2))', scope)
  }

  return (
    <div className="flex">
      <div className="basis-1/3 p-4">
        <Card>
          <CardBody>
            <div className='flex h-auto mb-4'>
              <Input className='flex-auto' label="X1" type='number' variant='flat'  placeholder='Introduzca la variable X1' value={x1} onValueChange={setX1}/>
            </div>
            <div className='flex h-auto mb-4'>
              <Input className='flex-auto' label="X2" type='number' variant='flat'  placeholder='Introduzca la variable X2' value={x2} onValueChange={setX2}/>
            </div>
            <div className='flex h-auto mb-4'>
              <Input className='flex-auto' label="E" type='number' variant='flat'  placeholder='Introduzca el error'value={error} onValueChange={setError}/>
            </div>

            <div className=' h-auto mb-4'>
              <Textarea label="Formula" labelPlacement="outside" placeholder="Introduzca la formula" className="h-auto"  value={formula} onValueChange={setFormula}/>
            </div>

            <div className='flex items-center h-auto mb-4' >
              <p className='p-0 mr-4'>Considerar un limite de interacciones?</p>
              <Switch isSelected={isSelect} onValueChange={setIsSelect}></Switch>
            </div>
            {
              isSelect === true &&
              <div className=' h-auto mb-4'>
                <Input className='flex-auto' label="Interacciones" type='number' variant='flat'  placeholder='Introduzca la cantidad de interacciones'/>
              </div>
            }
          </CardBody>


          <CardFooter>
            <Button color="success" onClick={onClick}>
              Success
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="p-4 basis-full">
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>X1</TableColumn>
            <TableColumn>X2</TableColumn>
            <TableColumn>F(X1)</TableColumn>
            <TableColumn>F(X2)</TableColumn>
            <TableColumn>Xr</TableColumn>
            <TableColumn>F(Xr)</TableColumn>
            <TableColumn>Xr -  X1</TableColumn>
          </TableHeader>
          <TableBody>
            {
              dataTable.map( (dato, index) =>(
                <TableRow key={index}>
                  <TableCell>{dato.x1}</TableCell>
                  <TableCell>{dato.x2}</TableCell>
                  <TableCell>{dato.fx1}</TableCell>
                  <TableCell>{dato.fx2}</TableCell>
                  <TableCell>{dato.xr}</TableCell>
                  <TableCell>{dato.fxr}</TableCell>
                  <TableCell>{dato.r}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>

        </Table>
      </div>
    </div>
  );
}

export default App

import React from 'react';
import '../resources/css/Table.css';
import numeral from "numeral";
function Table({countries}) {
    return (
        <div className="table">
            {countries.map(({country, cases, countryInfo}) => (
                <tr>
                    <td> 
                        <div 
                            className="table-flag "
                        >
                            <img 
                                src={countryInfo.flag } 
                                alt={country} 
                                style={{height:"26px",width:"38px"}}
                            />
                        </div>
                    </td>
                    <td>{country}</td>
                    <td>
                        <strong>
                            {numeral(cases).format()}
                        </strong>
                    </td>
                </tr>

            ))}
        </div>
    )
}

export default Table

import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core';
import '../resources/css/InfoTabs.css';

function InfoTabs({ title, cases, active, isRed, total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoTabs ${active && 'infoTabs--selected'} ${isRed && 'infoTabs--red'}`}>
            <CardContent>
                <Typography className="infoTabs__title" color="textSecondary">{title}</Typography>
                <h2 className={`infoTabs__cases ${!isRed && "infoTabs__cases--green"}`}>{cases}</h2>
                <Typography className="infoTabs__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoTabs

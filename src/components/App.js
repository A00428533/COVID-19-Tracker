import React, { useState, useEffect } from 'react';
import '../resources/css/App.css';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InfoTabs from './InfoTabs';
import Map from './Map';
import Table from './Table';
import { Card, CardContent} from '@material-ui/core';
import { sortData, prettyPrintStat} from '../resources/util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]); 
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({}); 
  const [tableData, setTableData] = useState([]); 
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796}); 
  const [mapZoom, setMapZoom] = useState(3); 
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType]  = useState("cases");


  useEffect(() => {
    const getCountries = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then(data => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))

          const sortedData = sortData(data);
          setTableData(sortedData)
          setCountries(countries);
          setMapCountries(data);
        })
    }
    getCountries();
  }, [countries])

  useEffect(() => {

    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    })

  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === "worldwide" 
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url) 
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className ="app__header">
          <h1>Coronavirus Live Updates</h1>
          <FormControl className="app__dropdownMenu" > 
            <Select 
              variant="outlined" 
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className= "app__stats">
          <InfoTabs
            isRed
            active={caseType === "cases"}
            onClick={e => setCaseType("cases")} 
            title="Active Cases" 
            cases ={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
          />
          <InfoTabs
            active={caseType === "recovered"} 
            onClick={e => setCaseType("recovered")} 
            title="Recovered" 
            cases ={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />
          {console.log(countryInfo)}
          <InfoTabs
            isRed
            active={caseType === "deaths"} 
            onClick={e => setCaseType("deaths")} 
            title="Deaths" 
            cases ={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <div className="app__map">
          <Map
            casesType={caseType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Active cases by Country</h3>
          <Table countries={tableData} />
        </CardContent>
        <h3 style={{marginTop: "10px", marginLeft: "10px", paddingBottom: "15px"}}>Worldwide new {caseType}</h3>
        <LineGraph caseType={caseType} />
      </Card>
    </div>
  );
}

export default App;

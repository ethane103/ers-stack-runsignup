function dropDownComponent() {



    return (

        <form method="POST" action="page2.html">
          <center>
            <label htmlFor="race-names">Choose a Race name:</label>
            <select name="race-names" id="race-names">
              <option selected value="race1">Race 1</option>
              <option value="race2">{message[1]}</option>
              <option value="race3">Race 3</option>
              <option value="race4">Race 4</option>
              <option value="race5">Race 5</option>         
            </select>
            <label htmlFor="event-names">Choose an Event name:</label>
            <select name="event-names" id="event-names">
              <option selected value="event1">1k</option>
              <option value="event2">2k</option>
              <option value="event3">3k</option>  
              <option value="event4">4k</option>
              <option value="event5">5k</option>
              <option value="event6">6k</option>
              <option value="event7">7k</option>   
              <option value="event8">8k</option> 
              <option value="event8">9k</option> 
            </select> 
            <br />
            <br />
            <input className="submit" type="submit" defaultValue="Submit" />
          </center>
        </form>
      );
    
}
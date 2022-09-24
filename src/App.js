import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react'
import './App.css'
import dataList from './mock';

const AutoCompletes = ({ allowedClear, icon }) => {
  const [display, setDisplay] = useState(false);
  const [letterBox, setLetterBox] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('')
  const [value, setValue] = useState('');
  const wrapperRef = useRef(null)

  useEffect(() => {
    dropdownFunc();
  }, [search]);

  const dropdownFunc = () => {
    setOptions([]);
    if(search.length > 2 && value !== search){
      setLetterBox(false);
      setDisplay(true);
      Object.values(dataList).forEach((val) => {
        if (val.name.toLowerCase().includes(search.toLowerCase()) || val.email.toLowerCase().includes(search.toLowerCase())){
          setOptions(prev => [...prev, { name: val.name, email: val.email}])
        }
      });
    } else {
      if (search.length > 0) {
        setLetterBox(true);
      }
      setDisplay(false);
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  });

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false)
      setLetterBox(false);
    }
  }

  const updatePokeDex = (poke) => {
    setValue(poke);
    setSearch(poke);
    setDisplay(false);
  }

  return (
    <div className="autoComplete-container">
      <div ref={wrapperRef} className="flex-container flex-column pos-rel">
        <div className="this-is-input-container">
          <input
            id="auto"
            onClick={()=>{
              dropdownFunc();
            }}
            placeholder="Type to search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {allowedClear && (
            <div className='icon-input-container clear'
              onClick={()=>{
                setSearch('');
              }}
            ><CloseOutlined /></div>
          )}
          <div className='icon-input-container'>{icon}</div>
        </div>
        {letterBox && (
          <div className="autoContainer">
            <div className="result-options search">
              <span>Required 3 lettes</span>
            </div>
          </div>
        )}
        {display && (
          <div className="autoContainer">
            <div className="title-option" style={{ marginTop: 5 }}>
              Search
            </div>
            <div className="result-options search">
              <div
              onClick={() => updatePokeDex(search)}
              className="option"
            >
              <span>{search}</span>
            </div>
            </div>
            <hr style={{ width: '90%', opacity: 0.7 }} />
            <div className="title-option">Result</div>
              {options.length ? (
              <div className="result-options">
                {options.map((value, i) => {
                    return (
                      <div
                        onClick={() => updatePokeDex(value.name)}
                        className="option"
                        key={i}
                        tabIndex="0"
                      >
                        <span>{value.name}</span>
                      </div>
                    )
                  })}
              </div>
              ):(
                <div className="result-options no-result">No Result</div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      {/* resize component in auto-container */}
      <div className="auto-container" style={{width: 300}}>
        <AutoCompletes 
          allowedClear={true}
          icon={<SearchOutlined />}
        />
      </div>
    </div>
  );
};

export default App;

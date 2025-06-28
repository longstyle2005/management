
export default function SelectTagManager ( 
	{ className, data, keyName, onChange, value } : 
	{ className : any, data : any, keyName : string, onChange : any, value : string }
) {
  	return (
        <select className={className}
            onChange={(e) => onChange(e.target.value)}
            value={value}
        >
            <option value='' >--- None ---</option>
            {data && data.length > 0 ? (
                data.map((item : any, index : any) => (
                    <option key={index} value={item.memberId}>
                        {item[keyName]}
                    </option>
                ))
            ) : (
                <option disabled>Please add members first</option>
            )}
        </select>
	)
}


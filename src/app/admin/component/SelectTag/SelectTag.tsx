
export default function SelectTag (
    {
        className, 
        data, 
        keyName, 
        onChange, 
        value,
    } : { 
        className : any, 
        data : any, 
        keyName : string, 
        onChange : any, 
        value : string,
    }
) {
  	return (
        <select className={className}
            onChange={(e) => onChange(e.target.value)}
            value={value}
        >
            {data && data.length > 0 ? (
                data.map((item : any, index : any) => (
                    <option key={index} value={item.id}>
                        {item[keyName]}
                    </option>
                ))
            ) : (
                <option disabled>No teams have been created yet</option>
            )}
        </select>
	)
}
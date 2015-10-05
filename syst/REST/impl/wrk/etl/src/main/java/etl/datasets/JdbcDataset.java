package etl.datasets;

import java.sql.ResultSet;
import java.sql.SQLException;

import etl.databases.JdbcDatabase;
import etl.exceptions.EtlException;



public class JdbcDataset extends ADataset<JdbcDatabase> {
	
	
	public static int MAX_ROW_SIZE = 60000;
	
	

	public JdbcDataset(JdbcDatabase jdbcDatabase, String name) {
		super(jdbcDatabase, name);
	}

	
	@Override
	public void disconnect() throws SQLException{
		getDatabase().diconnect();
	}
	
	@Override
	public boolean exists() throws SQLException{
		return getDatabase().datasetExists(Location);
	}
	
	@Override
	public void erase() throws SQLException{
		if(exists())
			getDatabase().query("DROP TABLE "+getFullLocation()+";");		
	}
	
	public ResultSet selectAll() throws SQLException{
		return getDatabase().select("SELECT * FROM " + getFullLocation());
	}
	
	
	
	@Override
	public String getFullLocation(){
		return "`"+getDatabase().getLocation()+"`.`"+getLocation()+"`";
	}
	
	@Override
	public void clear() throws SQLException{
		getDatabase().query("TRUNCATE "+getFullLocation()+";");
	}
	
	@Override
	public boolean connect() throws ClassNotFoundException, SQLException{		
		getDatabase().connect();
		return true;
	}
	
	@Override
	public void create(Schema schema) throws EtlException, SQLException{
		
		if(exists())
			erase();
		
		if(schema.getMemorySize() > MAX_ROW_SIZE){
			long lastSize = schema.getMemorySize();
			do{
				StringField biggestField = null;
				long biggestValue = 0;				
				for(AField field:schema.getFields()){
					if((field instanceof StringField)&&(field.getMemorySize() > biggestValue)){
						biggestValue = field.getMemorySize();
						biggestField = (StringField)field;
					}					
				}
				((StringField)biggestField).setBlobMode(true);
				
				if(schema.getMemorySize()==lastSize)
					throw new EtlException("Row size too big");
			}while(schema.getMemorySize()< MAX_ROW_SIZE);
		}
		
		StringBuilder s = new StringBuilder();
		s.append("CREATE TABLE "+getLocation()+"(");
		for(int i = 0; i<schema.getFields().size(); i++){
			if(i!=0)
				s.append(",");
			s.append("`" + schema.getField(i).getName() + "` ");
			if(schema.getField(i) instanceof IntegerField){
				IntegerField field = (IntegerField)schema.getField(i);				
				if(field.getMax()<Short.MAX_VALUE)					
					s.append("SHORTINT");
				else if(field.getMax()<Integer.MAX_VALUE)
					s.append("INT");
				else 
					s.append("BIGINT");
			}else if(schema.getField(i) instanceof DecimalField){
				DecimalField field = (DecimalField)schema.getField(i);
				s.append("DOUBLE PRECISION");
			}
			
			else if (schema.getField(i) instanceof StringField){
				StringField field = (StringField)schema.getField(i);
				if(field.getBlobMode())
					s.append("TEXT");
				else
					s.append("VARCHAR("+field.getSize()+")");				
			}else if(schema.getField(i) instanceof DatetimeField){
				s.append("DATETIME");
			}
			
		}
		s.append(") ENGINE = MYISAM");
		
		getDatabase().query(s.toString());
	}
	
	
	private Schema inferSchema() throws SQLException{				
		Schema schema = new Schema();
		ResultSet rs = getDatabase().getConnection().getMetaData().getColumns(getDatabase().getLocation(), null, getLocation(), null);
		while(rs.next()){
			AField field = null;
			int jdbcType  = rs.getInt("DATA_TYPE");
			switch(jdbcType){
			case java.sql.Types.VARCHAR:
				field = new StringField();				
				break;
			case java.sql.Types.INTEGER:
			case java.sql.Types.SMALLINT:
			case java.sql.Types.BIGINT:
			case java.sql.Types.TINYINT:
				field = new IntegerField();
				break;
			case java.sql.Types.DECIMAL:
			case java.sql.Types.DOUBLE:
				field = new DecimalField();
				break;
			case java.sql.Types.DATE:
			case java.sql.Types.TIMESTAMP:
			case java.sql.Types.TIME:
				field = new DatetimeField();
				break;
			default:
			}
			field.setName(rs.getString("COLUMN_NAME"));
			schema.addField(field);			
		}		
		return schema;
	}
	
	@Override
	public Schema getSchema() throws SQLException{
		if(Schema==null)
			Schema = inferSchema();
		return Schema;
	}
	
	
}

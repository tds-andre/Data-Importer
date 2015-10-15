package etl.datasets;

public enum SolrCoreFieldSuffix {
    STRING ("s", StringField.class),
    INTEGER   ("ti", IntegerField.class),
    DECIMAL   ("td", DecimalField.class),
    DATE    ("tdt", DatetimeField.class);

    private final String suffix;   // in kilograms
    private Class type; // in meters
    SolrCoreFieldSuffix(String suffix, Class type) {
        this.suffix = suffix;
        this.type = type;
    }
    public String suffix() { return suffix; }
    public Class type() { return type; }

    public static String suffixForType(Class type){		
    	if(type == StringField.class){
    		return SolrCoreFieldSuffix.STRING.suffix();
		}else if(type == DecimalField.class){			
			return SolrCoreFieldSuffix.DECIMAL.suffix();
		}else if(type == IntegerField.class){
			return SolrCoreFieldSuffix.INTEGER.suffix();
		}else if(type == DatetimeField.class){
			return SolrCoreFieldSuffix.DATE.suffix();
		}
    	return "";
    }
    
   
    /*public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Usage: java Planet <earth_weight>");
            System.exit(-1);
        }
        double earthWeight = Double.parseDouble(args[0]);
        double mass = earthWeight/EARTH.surfaceGravity();
        for (Planet p : Planet.values())
           System.out.printf("Your weight on %s is %f%n",
                             p, p.surfaceWeight(mass));
    }*/
}

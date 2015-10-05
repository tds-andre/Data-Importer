package etl.datasets;

public enum EFieldType {
	
	INTEGER{
		@Override
		public IntegerField createInstance(){
			return new IntegerField();
		}
	},STRING
	{
		@Override
		public StringField createInstance(){
			return new StringField();
		}
	},DECIMAL
	{
		@Override
		public DecimalField createInstance(){
			return new DecimalField();
		}
	},REGEX
	{
		@Override
		public RegexField createInstance(){
			return new RegexField();
		}
	},DATETIME
	{
		@Override
		public DatetimeField createInstance(){
			return new DatetimeField();
		}
	}/*,RAW
	{
		@Override
		public IntegerField createInstance(){
			return new IntegerField();
		}
	},BOOLEAN{
		@Override
		public IntegerField createInstance(){
			return new IntegerField();
		}
	}*/;
	@SuppressWarnings("rawtypes")
	public abstract AField createInstance();

}

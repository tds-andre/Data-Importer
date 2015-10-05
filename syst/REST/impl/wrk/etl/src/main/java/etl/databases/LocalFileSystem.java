package etl.databases;



/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

public class LocalFileSystem extends ADatabase
{
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @generated
	 */
	
	public LocalFileSystem(Directory tkn){
		super(tkn);
	}
	public LocalFileSystem(String loc){
		this(new Directory(loc));
	}
	public String getLocation(){
		return ((Directory)ConnectionToken).getLocation();
	}
	

}


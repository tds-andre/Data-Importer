package interpreter.databases;

import interpreter.utils.BreadcrumbItem;

import java.nio.file.Paths;


/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

public class Directory extends AConnectionToken
{
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @generated
	 */
	public Directory(){
		this("");		
	}
	public Directory(String location){
		super();		
		Location = BreadcrumbItem.preparePath(location, true);
				
	}
	
	public String getLocation(){
		return Location;
	}
}


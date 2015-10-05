package interpreter.databases;

import interpreter.exceptions.NotImplementedMethodException;
import interpreter.utils.BreadcrumbItem;

import java.sql.SQLException;


/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

public class ADatabase implements IDatabase
{
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @generated
	 * @ordered
	 */
	
	protected AConnectionToken ConnectionToken;
	
	public AConnectionToken getToken(){
		return ConnectionToken;		
	}
	
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @generated
	 * @ordered
	 */
	
	public ADatabase(AConnectionToken conTkn) {
		super();
		ConnectionToken = conTkn;
	}
	
	public ADatabase(){
		super();
		ConnectionToken = null;
	}
	
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @generated
	 * @ordered
	 */
	
	public void connect() throws Exception{
		throw new NotImplementedMethodException();	
	}
	
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @throws SQLException 
	 * @generated
	 * @ordered
	 */
	
	public void diconnect() throws Exception {
		throw new NotImplementedMethodException();
	}

	@Override
	public String getLocation() {
		return BreadcrumbItem.preparePath(ConnectionToken.Location);
	}
	
}


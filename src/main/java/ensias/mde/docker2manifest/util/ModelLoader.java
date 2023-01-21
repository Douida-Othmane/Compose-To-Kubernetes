package ensias.mde.docker2manifest.util;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EcorePackage;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emf.ecore.resource.impl.ResourceSetImpl;
import org.eclipse.emf.emfatic.core.EmfaticResource;
import org.eclipse.epsilon.emc.emf.InMemoryEmfModel;
import org.eclipse.epsilon.flexmi.FlexmiResourceFactory;

import java.io.ByteArrayInputStream;
import java.io.IOException;

public class ModelLoader
{
    public static InMemoryEmfModel getInMemoryFlexmiModel(String flexmi, String emfatic) throws IOException
    {
        ResourceSet resourceSet = new ResourceSetImpl();
        EPackage ePackage = getEPackage(emfatic);
        resourceSet.getPackageRegistry().put(ePackage.getNsURI(), ePackage);
        resourceSet.getResourceFactoryRegistry().getExtensionToFactoryMap().put("*", new FlexmiResourceFactory());
				System.out.println(resourceSet);

        Resource resource = resourceSet.createResource(URI.createURI("flexmi.flexmi"));
        resource.load(new ByteArrayInputStream(flexmi.getBytes()), null);
				System.out.println(resource);

        InMemoryEmfModel model = new InMemoryEmfModel(resource);
        return model;
    }

    public static InMemoryEmfModel getBlankInMemoryModel(String emfatic) throws IOException
    {
        ResourceSet resourceSet = new ResourceSetImpl();
        EPackage ePackage = getEPackage(emfatic);
				System.out.println(ePackage.toString());
        resourceSet.getPackageRegistry().put(ePackage.getNsURI(), ePackage);
        resourceSet.getResourceFactoryRegistry().getExtensionToFactoryMap().put("*", new FlexmiResourceFactory());

        Resource resource = resourceSet.createResource(URI.createURI("flexmi.flexmi"));

        InMemoryEmfModel model = new InMemoryEmfModel(resource);
        return model;
    }

    public static InMemoryEmfModel getInMemoryEmfaticModel(String emfatic) throws IOException
    {
        InMemoryEmfModel model = new InMemoryEmfModel(getEPackage(emfatic).eResource());
        model.setName("M");
        return model;
    }

    private static EPackage getEPackage(String emfatic) throws IOException
    {
        if(emfatic == null || emfatic.trim().isEmpty()) {
            return EcorePackage.eINSTANCE;
        }
        EmfaticResource emfaticResource = new EmfaticResource(URI.createURI("emfatic.emf"));
        emfaticResource.load(new ByteArrayInputStream(emfatic.getBytes()), null);

        if(!emfaticResource.getErrors().isEmpty()) {
            throw new RuntimeException(emfaticResource.getErrors().toString());
        }
        return (EPackage) emfaticResource.getContents().get(0);
    }
}


package ensias.mde.docker2manifest.service;

import jakarta.annotation.PostConstruct;
import org.eclipse.epsilon.emc.emf.InMemoryEmfModel;
import org.eclipse.epsilon.eol.exceptions.EolRuntimeException;
import org.eclipse.epsilon.etl.EtlModule;
import ensias.mde.docker2manifest.util.FileReader;
import ensias.mde.docker2manifest.util.ModelLoader;

import java.io.IOException;

public class ModelToModelService {
    private  String targetTransformation;
    private String dockerCompose;

    public InMemoryEmfModel modelToModelTransformation(String inputFlexmi, String targetFlexmi) throws Exception {
        EtlModule module = new EtlModule();
        if(!module.getParseProblems().isEmpty()){
            throw new RuntimeException(module.getParseProblems().get(0).toString());
        }
        module.getContext().setOutputStream(System.out);
        return runTransformation(
                module,
                inputFlexmi,
                dockerCompose,
                targetFlexmi
        );
    }

    private InMemoryEmfModel runTransformation(EtlModule module, String inputFlexmi, String inputEmfatic, String targetEmfatic)
            throws IOException, EolRuntimeException {
        InMemoryEmfModel inputModel = ModelLoader.getInMemoryFlexmiModel(inputFlexmi, inputEmfatic);
        inputModel.setName("Input");

        InMemoryEmfModel targetModel = ModelLoader.getInMemoryFlexmiModel(inputFlexmi, inputEmfatic);
        inputModel.setName("Target");

        module.getContext().getModelRepository().addModel(inputModel);
        module.getContext().getModelRepository().addModel(targetModel);
        module.execute();
        return targetModel;
    }

    @PostConstruct
    public void loadFiles()
    {
        targetTransformation = FileReader.readFile("transformations/compose2manifests.etl");
        dockerCompose = FileReader.readFile("models/gcipm.emf");
    }
}

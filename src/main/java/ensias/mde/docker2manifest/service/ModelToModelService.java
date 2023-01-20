package ensias.mde.docker2manifest.service;

import jakarta.annotation.PostConstruct;
import org.eclipse.epsilon.emc.emf.InMemoryEmfModel;
import org.eclipse.epsilon.eol.exceptions.EolRuntimeException;
import org.eclipse.epsilon.etl.EtlModule;
import ensias.mde.docker2manifest.util.FileReader;
import ensias.mde.docker2manifest.util.ModelLoader;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
@Service
public class ModelToModelService {
    private  String manifestK8S;
    private String dockerCompose;

    public InMemoryEmfModel modelToModelTransformation(String inputFlexmi) throws Exception {
        System.out.println("modeltomodeltr");
        EtlModule module = new EtlModule();
        module.parse(manifestK8S, new File("/program.etl"));
        if(!module.getParseProblems().isEmpty()){
            throw new RuntimeException(module.getParseProblems().get(0).toString());
        }
        module.getContext().setOutputStream(System.out);
        return runTransformation(
                module,
                inputFlexmi,
                dockerCompose,
                manifestK8S
        );
    }

    private InMemoryEmfModel runTransformation(EtlModule module, String inputFlexmi, String inputEmfatic, String manifestK8SEmfatic)
            throws IOException, EolRuntimeException {
        System.out.println("runTransformation");
        InMemoryEmfModel inputModel = ModelLoader.getInMemoryFlexmiModel(inputFlexmi, inputEmfatic);
        inputModel.setName("Input");

        InMemoryEmfModel manifestK8SModel = ModelLoader.getBlankInMemoryModel(manifestK8SEmfatic);
        inputModel.setName("Target");

        module.getContext().getModelRepository().addModel(inputModel);
        module.getContext().getModelRepository().addModel(manifestK8SModel);
        module.execute();
        return manifestK8SModel;
    }

    @PostConstruct
    public void loadFiles()
    {
        manifestK8S = FileReader.readFile("transformations/compose2manifest.etl");
        dockerCompose = FileReader.readFile("models/compose.emf");
    }
}

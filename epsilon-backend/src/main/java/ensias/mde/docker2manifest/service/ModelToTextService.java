package ensias.mde.docker2manifest.service;

import ensias.mde.docker2manifest.util.FileReader;
import org.eclipse.epsilon.egl.EglTemplateFactoryModuleAdapter;
import org.eclipse.epsilon.egl.IEglModule;
import org.eclipse.epsilon.emc.emf.InMemoryEmfModel;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;

@Service
public class ModelToTextService {
    private String modelToText = FileReader.readFile("transformations/manifest.egl");

    public String ModelToText(InMemoryEmfModel model) throws Exception
    {
        System.out.println("modeltotext");
        IEglModule module = (IEglModule) new EglTemplateFactoryModuleAdapter();
        module.parse(modelToText, new File("/program.egl"));
        if(!module.getParseProblems().isEmpty())
        {
            throw new RuntimeException(module.getParseProblems().get(0).toString());
        }
        module.getContext().getModelRepository().addModel(model);
        return module.execute() + "";
    }

   /* @PostConstruct
    public void loadFiles() {
        modelToText = FileReader.readFile("C:/Users/douid/Desktop/spring/Docker2Manifest/src/main/resources/transformations/manifest.egl");
    } */
}

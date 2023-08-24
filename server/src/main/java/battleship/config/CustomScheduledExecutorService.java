package battleship.config;

import jakarta.annotation.PreDestroy;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class CustomScheduledExecutorService {

    private final ScheduledExecutorService executor;

    public CustomScheduledExecutorService() {
        executor = Executors.newSingleThreadScheduledExecutor();
    }


    public ScheduledFuture<?> schedule(@NonNull  Runnable command, long delay, @NonNull TimeUnit unit) {
        return executor.schedule(command, delay, unit);
    }

    @PreDestroy
    public void shutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow();
                if (!executor.awaitTermination(60, TimeUnit.SECONDS))
                    log.error("Executor did not terminate.");
            }
        } catch (InterruptedException ie) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}

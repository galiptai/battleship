package battleship;

import battleship.service.GameConnectionService;
import battleship.websocket.WebsocketChannelInterceptor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.messaging.MessageChannel;

@SpringBootApplication
public class BattleshipApplication {

	public static void main(String[] args) {
		ApplicationContext app = SpringApplication.run(BattleshipApplication.class, args);

		WebsocketChannelInterceptor websocketChannelInterceptor = app.getBean(WebsocketChannelInterceptor.class);
		GameConnectionService gameConnectionService = app.getBean(GameConnectionService.class);
		MessageChannel clientOutboundChannel = app.getBean("clientOutboundChannel", MessageChannel.class);
		websocketChannelInterceptor.setGameConnectionService(gameConnectionService);
		websocketChannelInterceptor.setClientOutboundChannel(clientOutboundChannel);
	}

}

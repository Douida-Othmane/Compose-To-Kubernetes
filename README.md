<?nsuri compose?>
<compose version="1">
	<service name="my-app" image="node:latest">
		<port host="80" container="80">
		</port>
		<volume name="my-volume" container="/path/in/container">
		</volume>
		<environment name="PASSWORD" value="test">
		</environment>
	</service>
</compose>